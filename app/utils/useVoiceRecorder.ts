import { useState, useRef, useCallback } from 'react';

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  isProcessing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  error: string | null;
}

// Типы для Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Функция для правильной расстановки заглавных букв
function formatTextWithCapitalization(text: string): string {
  if (!text) return text;
  
  // Приводим весь текст к нижнему регистру сначала
  let lowerText = text.toLowerCase();
  let result = '';
  let shouldCapitalize = true;
  
  for (let i = 0; i < lowerText.length; i++) {
    const char = lowerText[i];
    const prevChar = i > 0 ? lowerText[i - 1] : '';
    const prevPrevChar = i > 1 ? lowerText[i - 2] : '';
    
    // Если это начало или после точки/восклицательного/вопросительного знака + пробел
    if (shouldCapitalize && /[а-яa-z]/.test(char)) {
      result += char.toUpperCase();
      shouldCapitalize = false;
    } else {
      result += char;
    }
    
    // После точки, восклицательного или вопросительного знака (и опционально пробела) следующую букву делаем заглавной
    if ((char === '.' || char === '!' || char === '?') && (prevPrevChar !== '.' || prevChar !== '.')) {
      shouldCapitalize = true;
    }
    // Если после знака препинания идет пробел, следующую букву тоже делаем заглавной
    if (shouldCapitalize && char === ' ') {
      // Продолжаем искать следующую букву для заглавной
    }
  }
  
  return result;
}

export function useVoiceRecorder(
  onTranscription: (text: string) => void
): UseVoiceRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const realtimeTextRef = useRef<string>('');
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      // Не сбрасываем realtimeTextRef - он должен сохранять текст между сессиями
      // realtimeTextRef.current = '';
      
      // Проверяем поддержку Web Speech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        // Fallback на старый способ, если Web Speech API не поддерживается
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported('audio/webm') 
            ? 'audio/webm' 
            : MediaRecorder.isTypeSupported('audio/mp4')
            ? 'audio/mp4'
            : 'audio/ogg'
        });

        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach(track => track.stop());
          
          const audioBlob = new Blob(audioChunksRef.current, { 
            type: mediaRecorder.mimeType 
          });
          
          setIsProcessing(true);
          try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');

            const response = await fetch('/api/transcribe', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to transcribe audio');
            }

            const data = await response.json();
            if (data.text) {
              onTranscription(data.text);
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to transcribe audio');
            console.error('Transcription error:', err);
          } finally {
            setIsProcessing(false);
          }
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
        return;
      }

      // Получаем доступ к микрофону
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Настраиваем MediaRecorder для записи (для финальной обработки через Whisper)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/ogg'
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        
        // Отправляем на Whisper для финальной обработки
        setIsProcessing(true);
        try {
          const audioBlob = new Blob(audioChunksRef.current, { 
            type: mediaRecorder.mimeType 
          });
          
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');

          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to transcribe audio');
          }

          const data = await response.json();
          if (data.text) {
            // Используем финальный результат от Whisper только если real-time текст был очень коротким
            // или пустым (fallback если Web Speech API не сработал)
            const finalText = data.text.trim();
            const realtimeText = realtimeTextRef.current.trim();
            
            // Если real-time текст был очень коротким, заменяем его на результат Whisper
            if (realtimeText.length < 10 || realtimeText.split(/\s+/).length < 3) {
              // Очищаем и заменяем весь текст на результат Whisper
              realtimeTextRef.current = finalText + ' ';
              onTranscription(finalText);
            }
            // Иначе не делаем ничего - real-time текст уже был добавлен
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to transcribe audio');
          console.error('Transcription error:', err);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;

      // Настраиваем SpeechRecognition для real-time транскрипции
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      // Используем несколько языков для лучшего распознавания
      recognition.lang = navigator.language || 'ru-RU';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let newFinalText = '';

        // Обрабатываем только новые результаты, начиная с resultIndex
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.trim();
          if (event.results[i].isFinal) {
            newFinalText += transcript + ' ';
          } else {
            interimTranscript = transcript; // Только последний interim результат
          }
        }

        // Обновляем текст в реальном времени
        if (newFinalText) {
          // Добавляем новый финальный текст (приводим к нижнему регистру, чтобы убрать автоматические заглавные)
          // Проверяем, нужно ли добавить пробел перед новым текстом
          const needsSpace = realtimeTextRef.current && !realtimeTextRef.current.match(/\s$/);
          realtimeTextRef.current += (needsSpace ? ' ' : '') + newFinalText.trim().toLowerCase() + ' ';
          // Форматируем весь текст с правильными заглавными буквами
          const fullText = realtimeTextRef.current.trim() + (interimTranscript ? ' ' + interimTranscript.toLowerCase() : '');
          onTranscription(formatTextWithCapitalization(fullText));
        } else if (interimTranscript) {
          // Для interim текста показываем накопленный + текущий interim (в нижнем регистре)
          const fullText = realtimeTextRef.current.trim() + ' ' + interimTranscript.toLowerCase();
          onTranscription(formatTextWithCapitalization(fullText));
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setError(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        // Если запись все еще идет, перезапускаем recognition
        if (isRecording && mediaRecorderRef.current?.state === 'recording') {
          try {
            recognition.start();
          } catch (e) {
            // Игнорируем ошибки перезапуска
          }
        }
      };

      recognitionRef.current = recognition;
      
      // Запускаем оба процесса
      recognition.start();
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to access microphone');
      console.error('Recording error:', err);
    }
  }, [onTranscription, isRecording]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    // Останавливаем SpeechRecognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Игнорируем ошибки
      }
      recognitionRef.current = null;
    }

    // Останавливаем MediaRecorder (обработка через Whisper произойдет в onstop)
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    // Останавливаем поток
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Сбрасываем накопленный текст
    realtimeTextRef.current = '';

    return null;
  }, [isRecording]);

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    error,
  };
}
