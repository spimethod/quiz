import { useState, useRef, useCallback } from 'react';

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  isProcessing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  clearTranscription: () => void;
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
    
    // Если это начало или после точки/восклицательного/вопросительного знака
    if (shouldCapitalize && /[а-яa-z]/.test(char)) {
      result += char.toUpperCase();
      shouldCapitalize = false;
    } else {
      result += char;
    }
    
    // После точки, восклицательного или вопросительного знака следующую букву делаем заглавной
    if (char === '.' || char === '!' || char === '?') {
      shouldCapitalize = true;
    }
  }
  
  return result;
}

export function useVoiceRecorder(
  onTranscription: (text: string) => void,
  getCurrentText?: () => string // Функция для получения текущего текста из компонента
): UseVoiceRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const realtimeTextRef = useRef<string>('');
  const streamRef = useRef<MediaStream | null>(null);
  const wasClearedRef = useRef<boolean>(false); // Флаг для отслеживания очистки во время записи
  const baseTextRef = useRef<string>(''); // Базовый текст (написанный до начала записи)
  const isRecordingRef = useRef<boolean>(false); // Ref для отслеживания состояния записи

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      // Сохраняем текущий текст как базовый (если есть функция для его получения)
      if (getCurrentText) {
        const currentText = getCurrentText();
        // Сохраняем текущий текст как базовый (написанный до начала записи)
        baseTextRef.current = currentText.trim();
      } else {
        baseTextRef.current = '';
      }
      realtimeTextRef.current = ''; // Сбрасываем наговоренный текст для новой записи
      wasClearedRef.current = false; // Сбрасываем флаг очистки при начале новой записи
      
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
            // и НЕ был очищен во время записи (fallback если Web Speech API не сработал)
            const finalText = data.text.trim();
            const realtimeText = realtimeTextRef.current.trim();
            
            // Если текст был очищен во время записи, НЕ используем Whisper вообще
            if (wasClearedRef.current) {
              return; // Выходим без вызова onTranscription
            }
            
            // Проверяем, что Whisper вернул не мусорный текст (не пустой, не очень короткий мусор)
            // Типичные мусорные результаты Whisper: ".", "Thanks for watching!", "[Music]", "[Silence]" и т.д.
            const isJunkText = !finalText || 
              finalText.length < 2 || 
              /^(\.|,|…|…|thanks for watching|thanks for watching!|\[music\]|\[silence\]|\[noise\]|you|the)$/i.test(finalText);
            
            // Если real-time текст пустой или очень короткий
            if (!realtimeText || realtimeText.length < 5) {
              // Используем Whisper только если он вернул не мусорный текст
              if (!isJunkText) {
                realtimeTextRef.current = finalText.toLowerCase() + ' ';
                const baseText = baseTextRef.current.trim();
                const combinedText = baseText ? (baseText + ' ' + finalText) : finalText;
                onTranscription(formatTextWithCapitalization(combinedText));
              }
              // Если Whisper вернул мусор, ничего не делаем - текст остается пустым
            } else if (realtimeText.length < 10 || realtimeText.split(/\s+/).length < 3) {
              // Real-time текст короткий, но есть - используем его
              const baseText = baseTextRef.current.trim();
              const combinedText = baseText ? (baseText + ' ' + realtimeText) : realtimeText;
              onTranscription(formatTextWithCapitalization(combinedText));
            } else {
              // Real-time текст достаточно длинный, комбинируем с базовым
              const baseText = baseTextRef.current.trim();
              const combinedText = baseText ? (baseText + ' ' + realtimeText) : realtimeText;
              onTranscription(formatTextWithCapitalization(combinedText));
            }
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
        // Если текст был очищен, игнорируем ВСЕ результаты до перезапуска recognition
        // (recognition будет перезапущен в startRecording, если нужно)
        if (wasClearedRef.current) {
          return; // Полностью игнорируем все результаты
        }

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
          // Комбинируем базовый текст (написанный) + новый текст (наговоренный)
          const baseText = baseTextRef.current.trim();
          const newText = realtimeTextRef.current.trim();
          const fullText = baseText ? (baseText + ' ' + newText) : newText;
          const finalText = fullText + (interimTranscript ? ' ' + interimTranscript.toLowerCase() : '');
          onTranscription(formatTextWithCapitalization(finalText));
        } else if (interimTranscript) {
          // Для interim текста показываем базовый + накопленный + текущий interim
          const baseText = baseTextRef.current.trim();
          const newText = realtimeTextRef.current.trim();
          const fullText = baseText ? (baseText + ' ' + newText + ' ' + interimTranscript.toLowerCase()) : (newText + ' ' + interimTranscript.toLowerCase());
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
      isRecordingRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to access microphone');
      console.error('Recording error:', err);
    }
  }, [onTranscription, isRecording, getCurrentText]);

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
      isRecordingRef.current = false;
    }

    // Останавливаем поток
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Сбрасываем флаг очистки после остановки (для следующей записи)
    // Но сохраняем baseTextRef и realtimeTextRef - они нужны для финальной обработки

    return null;
  }, [isRecording]);

  const clearTranscription = useCallback(() => {
    // Очищаем весь текст (и базовый, и наговоренный) и устанавливаем флаг очистки
    realtimeTextRef.current = '';
    baseTextRef.current = '';
    wasClearedRef.current = true;
    
    // Останавливаем recognition, чтобы очистить все накопленные результаты
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      } catch (e) {
        // Игнорируем ошибки
      }
    }
    
    // Немедленно очищаем текст в компоненте
    onTranscription('');
    
    // Если запись всё ещё идёт, перезапускаем recognition для нового текста (с чистого листа)
    // Используем setTimeout чтобы дать время старому recognition полностью остановиться
    if (isRecordingRef.current && mediaRecorderRef.current?.state === 'recording') {
      setTimeout(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition && streamRef.current && !recognitionRef.current) {
          try {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = navigator.language || 'ru-RU';
            
            // Используем ту же логику обработки результатов, что и в startRecording
            recognition.onresult = (event: any) => {
              // После перезапуска recognition начинаем с чистого листа
              let interimTranscript = '';
              let newFinalText = '';

              for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript.trim();
                if (event.results[i].isFinal) {
                  newFinalText += transcript + ' ';
                } else {
                  interimTranscript = transcript;
                }
              }

              if (newFinalText) {
                const needsSpace = realtimeTextRef.current && !realtimeTextRef.current.match(/\s$/);
                realtimeTextRef.current += (needsSpace ? ' ' : '') + newFinalText.trim().toLowerCase() + ' ';
                const baseText = baseTextRef.current.trim();
                const newText = realtimeTextRef.current.trim();
                const fullText = baseText ? (baseText + ' ' + newText) : newText;
                const finalText = fullText + (interimTranscript ? ' ' + interimTranscript.toLowerCase() : '');
                onTranscription(formatTextWithCapitalization(finalText));
              } else if (interimTranscript) {
                const baseText = baseTextRef.current.trim();
                const newText = realtimeTextRef.current.trim();
                const fullText = baseText ? (baseText + ' ' + newText + ' ' + interimTranscript.toLowerCase()) : (newText + ' ' + interimTranscript.toLowerCase());
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
              if (isRecordingRef.current && mediaRecorderRef.current?.state === 'recording') {
                try {
                  recognition.start();
                } catch (e) {
                  // Игнорируем ошибки
                }
              }
            };

            recognitionRef.current = recognition;
            recognition.start();
            // Сбрасываем флаг очистки после перезапуска recognition (новый recognition не имеет старых результатов)
            wasClearedRef.current = false;
          } catch (e) {
            console.error('Failed to restart recognition:', e);
          }
        }
      }, 100);
    }
  }, [onTranscription]);

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    clearTranscription,
    error,
  };
}
