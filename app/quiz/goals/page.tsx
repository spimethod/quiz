'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QuizLayout from '../../components/QuizLayout';

export default function GoalsPage() {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [customValue, setCustomValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [shouldAutoFocus, setShouldAutoFocus] = useState(false);
  const customInputRef = useRef<HTMLDivElement>(null);
  const continueBtnRef = useRef<HTMLButtonElement>(null);
  const CURRENT_STEP = 23;
  const TOTAL_STEPS = 32;

  const goalOptions = [
    'Cognitive tools',
    'Stress relief',
    'Better sleep',
    'Mood boost',
    'Motivation',
    'Relaxation',
    'Self-awareness',
    'Confidence',
    'Support'
  ];

  const handleOptionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const option = e.currentTarget.dataset.option;
    if (!option) return;
    
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleAddCustom = () => {
    if (customValue.trim()) {
      setSelectedOptions([...selectedOptions, customValue.trim()]);
      setCustomValue('');
      setIsExpanded(false);
      setIsRecording(false);
      setShouldAutoFocus(false);
      // Scroll to Continue button after closing
      setTimeout(() => {
        const continueButton = continueBtnRef.current;
        if (continueButton) {
          continueButton.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          });
        } else {
          // If button is not rendered yet, scroll to bottom
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const handleMicClick = () => {
    setIsRecording(!isRecording);
  };

  const handleContinue = () => {
    if (selectedOptions.length > 0 || customValue.trim()) {
      if (typeof window !== 'undefined') {
        // Add custom value to selected if not already added
        const finalSelected = customValue.trim() && !selectedOptions.includes(customValue.trim())
          ? [...selectedOptions, customValue.trim()]
          : selectedOptions;
        localStorage.setItem('goals', JSON.stringify({
          selected: finalSelected,
          custom: ''
        }));
      }
      router.push('/quiz/community');
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideInput = customInputRef.current?.contains(target);
      const clickedContinue = continueBtnRef.current?.contains(target);
      // Check if clicked on an option button
      const clickedOption = (target as HTMLElement).closest?.('[data-option]');
      if (!clickedInsideInput && !clickedContinue && !clickedOption) {
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
  }, [isExpanded]);

  // Hide footer when expanded
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

  // Simple scroll: just scroll input container to top of screen when expanded
  useEffect(() => {
    if (!isExpanded || !customInputRef.current) return;

    // Use scrollIntoView with block: 'start' to position input at top
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

  // Reduce padding under Continue button when keyboard is open
  useEffect(() => {
    if (!isExpanded || !(selectedOptions.length > 0 || customValue.trim())) return;

    const adjustPadding = () => {
      const continueButtonContainer = document.getElementById('continue-button-container');
      if (!continueButtonContainer) return;

      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.innerHeight;
      const keyboardOpen = windowHeight - viewportHeight > 150;

      if (keyboardOpen) {
        continueButtonContainer.style.paddingBottom = '4px';
        continueButtonContainer.style.paddingTop = '4px';
      } else {
        continueButtonContainer.style.paddingBottom = '';
        continueButtonContainer.style.paddingTop = '';
      }
    };

    const timeoutId = setTimeout(adjustPadding, 100);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', adjustPadding);
      return () => {
        clearTimeout(timeoutId);
        window.visualViewport?.removeEventListener('resize', adjustPadding);
      };
    } else {
      window.addEventListener('resize', adjustPadding);
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', adjustPadding);
      };
    }
  }, [isExpanded, customValue, selectedOptions]);

  // Auto-scroll up to show options above Continue button when it appears
  useEffect(() => {
    if (!isExpanded && (selectedOptions.length > 0 || customValue.trim())) {
      const scrollUp = () => {
        const continueButton = continueBtnRef.current;
        if (continueButton) {
          // Get button position
          const buttonRect = continueButton.getBoundingClientRect();
          const buttonTop = buttonRect.top + window.pageYOffset;
          
          // Calculate scroll position so options are visible above the button
          // Footer height is approximately 100px, so we want options to be above that
          const targetScroll = buttonTop - window.innerHeight + 100;
          
          window.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: 'smooth'
          });
        }
      };

      // Try multiple times to ensure button is rendered
      setTimeout(scrollUp, 100);
      setTimeout(scrollUp, 300);
      setTimeout(scrollUp, 500);
    }
  }, [selectedOptions, customValue, isExpanded]);

  const footerContent = !isExpanded && (selectedOptions.length > 0 || customValue.trim()) ? (
    <div className="max-w-sm mx-auto w-full">
      <button
        onClick={handleContinue}
        onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
        ref={continueBtnRef}
        className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 select-none bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
        style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
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
      <div className="max-w-[800px] w-full mx-auto pt-[30px]">
        {/* Title */}
        <div className="mb-3 sm:mb-4 mt-4 sm:mt-6 text-center">
          <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 leading-tight max-w-[540px] mx-auto [zoom:110%]:text-[min(4vw,2.5rem)] [zoom:125%]:text-[min(3.5vw,2rem)] [zoom:150%]:text-[min(3vw,1.75rem)]">
            What is the primary result you would like to achieve in your first week with Avocado?
          </h1>
        </div>

        {/* Description */}
        <div className="mb-8 sm:mb-10 text-center">
          <p className="text-gray-600 text-base sm:text-lg md:text-xl [zoom:110%]:text-[min(3vw,1.25rem)] [zoom:125%]:text-[min(2.5vw,1.1rem)] [zoom:150%]:text-[min(2vw,1rem)]">
            Let's find out what matters most to you, so I can support you in the best way!
          </p>
        </div>

        {/* Avocado Image */}
        <div className="flex justify-center mb-6">
          <Image
            src="/goals-avocado.png"
            alt="Goals Avocado"
            width={400}
            height={400}
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 max-w-[35vh] max-h-[35vh] object-contain"
          />
        </div>

        {/* Goal Options */}
        <div className={`mb-4 sm:mb-6 ${isExpanded ? 'mb-0' : ''}`}>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-4">
          {goalOptions.map((option) => (
            <button
              key={option}
                type="button"
                data-option={option}
                onClick={handleOptionClick}
              className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 active:scale-95 select-none ${
                selectedOptions.includes(option)
                  ? 'bg-[#6B9D47] text-white shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#6B9D47]'
              }`}
                style={{ 
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Custom Input - Collapsed/Expanded (same behavior as feelings step) */}
          <div ref={customInputRef} className={`w-full max-w-md mx-auto ${isExpanded ? 'mb-0' : ''}`}>
          {!isExpanded ? (
            /* Collapsed: Input + Button in one line */
            <div
              className={`flex items-center gap-2 border-2 rounded-full px-4 py-2.5 bg-white cursor-text transition-all duration-200 ${
                customValue.trim() ? 'border-[#6B9D47] bg-[#f0fdf4]' : 'border-gray-300'
              }`}
            >
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onFocus={(e) => {
                  // Prevent zoom on iOS
                  if (e.target instanceof HTMLInputElement) {
                    e.target.style.fontSize = '16px';
                  }
                  setIsExpanded(true);
                  setShouldAutoFocus(true);
                  setIsRecording(false);
                }}
                onClick={() => {
                  setIsExpanded(true);
                  setShouldAutoFocus(true);
                  setIsRecording(false);
                }}
                placeholder="+ Add Your Own"
                className="flex-1 bg-transparent outline-none text-sm sm:text-base text-gray-700 placeholder-gray-400 cursor-text"
                style={{ fontSize: '16px' }}
              />
              <button
                onClick={() => {
                  setIsExpanded(true);
                  setIsRecording(true);
                  setShouldAutoFocus(false);
                }}
                className="bg-[#6B9D47] hover:bg-[#5d8a3d] text-white px-5 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all shadow-sm hover:shadow-md flex-shrink-0"
              >
                Start talking
              </button>
            </div>
          ) : (
            /* Expanded: Textarea + Mic button */
            <div className={`relative border-2 ${customValue.trim() ? 'border-[#6B9D47]' : 'border-gray-300'} rounded-3xl p-4 bg-white transition-colors duration-200`}>
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
                className={`absolute top-3 right-3 w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 ${
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

      {/* Floating Continue Button - shown when expanded AND (option selected OR has custom text) */}
      {isExpanded && (selectedOptions.length > 0 || customValue.trim()) && (
        <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-1 pt-2 bg-[#f5f5f0] animate-slide-up" id="continue-button-container">
          <div className="max-w-sm mx-auto w-full">
            <button
              onClick={handleContinue}
              onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
              ref={continueBtnRef}
              className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 select-none bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      </div>
    </QuizLayout>
  );
}