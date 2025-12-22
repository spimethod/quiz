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

  const handleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const optionId = e.currentTarget.getAttribute('data-option');
    if (!optionId) return;
    
    setSelectedGoal(optionId);
    // Текст в кастомном поле сохраняется, но не используется при выборе другой опции
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
      // Оставляем поле открытым, выбор уже на custom
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
      const target = event.target as Node;
      const clickedInsideInput = customInputRef.current?.contains(target);
      if (!clickedInsideInput) {
        // Don't close on click outside - selection is exclusive, closing happens only when selecting another option
      }
    };

    if (isExpanded) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isExpanded]);

  // Scroll up when Continue button appears (only when collapsing input, not during typing)
  useEffect(() => {
    const hasSelection = selectedGoal && (selectedGoal !== 'custom' || customValue.trim());
    // Only scroll when collapsing expanded input, not during active typing
    if (hasSelection && !isExpanded) {
      // Use a debounce to avoid scrolling on every keystroke
      const timeoutId = setTimeout(() => {
        const footer = document.querySelector('footer');
        if (footer && !isExpanded) {
          footer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 300); // Debounce to avoid scrolling during typing
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedGoal, isExpanded]); // Removed customValue from dependencies to prevent scroll on every keystroke

  // Hide footer when expanded, show floating button instead
  useEffect(() => {
    const footer = document.querySelector('footer') as HTMLElement | null;
    if (!footer) return;

    if (isExpanded) {
      footer.style.display = 'none';
    } else {
      footer.style.display = '';
    }

    return () => {
      footer.style.display = '';
    };
  }, [isExpanded]);

  // Scroll custom field into view when expanded (to avoid browser bar covering it)
  useEffect(() => {
    if (!isExpanded || !customInputRef.current) return;

    const scrollToInput = () => {
      if (customInputRef.current) {
        customInputRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    // Initial scroll after DOM update
    const timeoutId = setTimeout(scrollToInput, 150);

    // Re-scroll when keyboard opens/closes
    if (window.visualViewport) {
      const handleViewportChange = () => {
        setTimeout(scrollToInput, 100);
      };
      
      window.visualViewport.addEventListener('resize', handleViewportChange);
      
      return () => {
        clearTimeout(timeoutId);
        window.visualViewport?.removeEventListener('resize', handleViewportChange);
      };
    }

    return () => clearTimeout(timeoutId);
  }, [isExpanded]);

  const footerContent = !isExpanded && selectedGoal && (selectedGoal !== 'custom' || customValue.trim()) ? (
    <div className="max-w-sm mx-auto w-full">
      <button
        onClick={handleContinue}
        onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
        className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 select-none bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
      >
        Continue
      </button>
    </div>
  ) : null;

  return (
    <QuizLayout
      currentStep={CURRENT_STEP}
      totalSteps={TOTAL_STEPS}
      footer={footerContent}
      className="px-4 sm:px-6 md:px-8 lg:px-10"
    >
      <div className="max-w-md w-full mx-auto pt-[30px]">
        
        {/* Title */}
        <div className="text-center mb-2 sm:mb-3">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] leading-tight">
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
                data-option={option.id}
                onClick={handleSelect}
                className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none ${
                  isSelected
                    ? 'bg-[#f0fdf4] border-[#6B9D47] shadow-md scale-[1.02]'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                style={{
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
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
              selectedGoal === 'custom'
                ? (customValue.trim() ? 'border-[#6B9D47] bg-[#f0fdf4]' : 'border-gray-300')
                : 'border-gray-300'
            }`}
            >
              <input
                type="text"
                value=""
                readOnly
                onFocus={(e) => {
                  // Prevent zoom on iOS
                  if (e.target instanceof HTMLInputElement) {
                    e.target.style.fontSize = '16px';
                  }
                  handleCustomSelect({ autoFocus: true, startRecording: false });
                }}
                onClick={() => handleCustomSelect({ autoFocus: true, startRecording: false })}
                placeholder="+ Add Your Own"
                className="flex-1 bg-transparent outline-none text-sm sm:text-base text-gray-700 placeholder-gray-400 cursor-text"
                style={{ fontSize: '16px' }}
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
          <div className={`relative border-2 ${customValue.trim() ? 'border-[#6B9D47]' : 'border-gray-300'} rounded-3xl p-4 bg-white`}>
              <textarea
                value={customValue}
                onChange={(e) => {
                  setCustomValue(e.target.value);
                  if (isRecording) setIsRecording(false);
                }}
                onFocus={(e) => {
                  // Prevent zoom on iOS
                  if (e.target instanceof HTMLTextAreaElement) {
                    e.target.style.fontSize = '16px';
                  }
                  if (isRecording) setIsRecording(false);
                }}
                placeholder={isRecording ? "Speak please..." : "Type please..."}
                className="w-full h-32 bg-transparent outline-none resize-none overflow-y-auto pr-14 text-sm sm:text-base text-gray-700 placeholder-gray-400"
                autoFocus={shouldAutoFocus}
                style={{ fontSize: '16px' }}
              />
              {/* Microphone button - top right corner */}
              <button
                onClick={handleMicClick}
                className={`absolute top-3 right-3 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
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

      {/* Floating Continue Button - appears when custom field is expanded AND something is selected */}
      {isExpanded && selectedGoal && (selectedGoal !== 'custom' || customValue.trim()) && (
        <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-1 pt-2 bg-[#f5f5f0] animate-slide-up">
          <div className="max-w-sm mx-auto w-full">
            <button
              onClick={handleContinue}
              onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
              className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 select-none bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </QuizLayout>
  );
}
