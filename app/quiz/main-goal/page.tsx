'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QuizLayout from '../../components/QuizLayout';

// Total steps before email capture
const TOTAL_STEPS = 12;
const CURRENT_STEP = 9;

const goalOptions = [
  { id: 'stress', label: 'Reduce daily stress', icon: 'goal-stress.png' },
  { id: 'emotion', label: 'Feel emotionally stable', icon: 'goal-emotion.png' },
  { id: 'sleep', label: 'Sleep better', icon: 'goal-sleep.png' },
  { id: 'relationships', label: 'Improve relationships', icon: 'goal-relationships.png' },
  { id: 'wellness', label: 'Just want to feel better', icon: 'goal-wellness.png' },
];

export default function MainGoalPage() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [shouldAutoFocus, setShouldAutoFocus] = useState(false);
  const customInputRef = useRef<HTMLDivElement>(null);

  const handleSelect = (id: string) => {
    setSelectedGoal(id);
    setCustomValue(''); // Сброс кастомного текста при выборе опции
    setIsExpanded(false); // Закрыть кастомное поле
    setIsRecording(false);
    setShouldAutoFocus(false);
  };

  const handleCustomSelect = ({
    autoFocus = true,
    startRecording = false,
  }: {
    autoFocus?: boolean;
    startRecording?: boolean;
  } = {}) => {
    setSelectedGoal('custom');
    setIsExpanded(true);
    setShouldAutoFocus(autoFocus);
    setIsRecording(startRecording);
  };

  const handleAddCustom = () => {
    if (customValue.trim()) {
      // Кастомное значение уже выбрано, просто закрываем поле
      setIsExpanded(false);
      setIsRecording(false);
      setShouldAutoFocus(false);
    }
  };

  const handleMicClick = () => {
    setIsRecording(!isRecording);
  };

  const handleContinue = () => {
    const goalToSave = selectedGoal === 'custom' ? customValue.trim() : selectedGoal;
    if (goalToSave) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('mainGoal', JSON.stringify({
          type: selectedGoal,
          value: goalToSave
        }));
      }
      router.push('/quiz/overall');
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customInputRef.current && !customInputRef.current.contains(event.target as Node)) {
        if (selectedGoal === 'custom' && !customValue.trim()) {
          setSelectedGoal(null); // Снять выбор если кастомное поле пустое
        }
        setIsExpanded(false);
        setIsRecording(false);
        setShouldAutoFocus(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isExpanded, selectedGoal, customValue]);

  // Scroll into view when expanded
  useEffect(() => {
    if (isExpanded && customInputRef.current) {
      setTimeout(() => {
        customInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [isExpanded]);

  const footerContent = (
    <div className="max-w-sm mx-auto w-full">
      <button
        onClick={handleContinue}
        onTouchEnd={(e) => { if (selectedGoal && (selectedGoal !== 'custom' || customValue.trim())) { e.preventDefault(); handleContinue(); } }}
        disabled={!selectedGoal || (selectedGoal === 'custom' && !customValue.trim())}
        className={`w-full font-semibold text-base sm:text-lg md:text-xl py-2.5 sm:py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 select-none ${
          selectedGoal && (selectedGoal !== 'custom' || customValue.trim())
            ? 'bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );

  return (
    <QuizLayout
      currentStep={CURRENT_STEP}
      totalSteps={TOTAL_STEPS}
      footer={footerContent}
      className="px-4 sm:px-6 md:px-8 lg:px-10"
    >
      <div className="max-w-md w-full mx-auto pt-2 sm:pt-4">
        
        {/* Title */}
        <div className="text-center mb-2 sm:mb-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1a1a1a] leading-tight">
            What's your main goal for improving your mental health?
          </h1>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed px-4">
            Visualizing your goal helps Avocado adjust your personal plan
          </p>
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4">
          {goalOptions.map((option) => {
            const isSelected = selectedGoal === option.id;
            return (
              <div
                key={option.id}
                onClick={() => handleSelect(option.id)}
                onTouchEnd={(e) => { e.preventDefault(); handleSelect(option.id); }}
                className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none ${
                  isSelected
                    ? 'bg-[#f0fdf4] border-[#6B9D47] shadow-md scale-[1.02]'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {/* Icon */}
                <div className="relative w-6 h-6 sm:w-8 sm:h-8 mr-4 flex-shrink-0">
                  <Image
                    src={`/${option.icon}`}
                    alt={option.label}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Label */}
                <span className={`flex-1 text-sm sm:text-base font-medium ${isSelected ? 'text-[#1a1a1a]' : 'text-gray-700'}`}>
                  {option.label}
                </span>

                {/* Radio Circle */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'border-[#6B9D47] bg-[#6B9D47]' : 'border-gray-300 bg-white'
                }`}>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Input - Collapsed/Expanded */}
        <div ref={customInputRef} className="w-full">
          {!isExpanded ? (
            /* Collapsed: Input + Button in one line */
            <div 
              className={`flex items-center gap-2 border-2 rounded-full px-4 py-2.5 bg-white cursor-text transition-all duration-200 ${
                selectedGoal === 'custom' ? 'border-[#6B9D47] bg-[#f0fdf4]' : 'border-[#6B9D47]'
              }`}
            >
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onFocus={() => handleCustomSelect({ autoFocus: true, startRecording: false })}
                onClick={() => handleCustomSelect({ autoFocus: true, startRecording: false })}
                placeholder="+ Add Your Own"
                className="flex-1 bg-transparent outline-none text-sm sm:text-base text-gray-700 placeholder-gray-400 cursor-text"
              />
              <button
                onClick={() => handleCustomSelect({ autoFocus: false, startRecording: true })}
                className="bg-[#6B9D47] hover:bg-[#5d8a3d] text-white px-5 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all shadow-sm hover:shadow-md flex-shrink-0"
              >
                Start talking
              </button>
            </div>
          ) : (
            /* Expanded: Textarea + Mic button */
            <div className="relative border-2 border-[#6B9D47] rounded-3xl p-4 bg-white">
              <textarea
                value={customValue}
                onChange={(e) => {
                  setCustomValue(e.target.value);
                  if (isRecording) setIsRecording(false);
                }}
                onFocus={() => {
                  if (isRecording) setIsRecording(false);
                }}
                placeholder={isRecording ? "Speak please..." : "Type please..."}
                className="w-full h-32 bg-transparent outline-none resize-none overflow-y-auto pr-14 text-sm sm:text-base text-gray-700 placeholder-gray-400"
                autoFocus={shouldAutoFocus}
              />
              {/* Microphone button - bottom right corner */}
              <button
                onClick={handleMicClick}
                className={`absolute bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-[#6B9D47] animate-pulse shadow-lg' 
                    : 'bg-[#6B9D47] hover:bg-[#5d8a3d] shadow-md'
                }`}
              >
                {/* Microphone SVG Icon */}
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

      </div>
    </QuizLayout>
  );
}
