'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QuizLayout from '../../components/QuizLayout';

export default function PsychiatricConditionsPage() {
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [shouldAutoFocus, setShouldAutoFocus] = useState(false);
  const [selectedButton, setSelectedButton] = useState<'yes' | 'no' | null>(null);
  const customInputRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const continueBtnRef = useRef<HTMLButtonElement>(null);
  const CURRENT_STEP = 19;
  const TOTAL_STEPS = 32;

  const handleNo = () => {
    setSelectedButton('no');
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('psychiatricConditions', JSON.stringify({ hasConditions: false, details: '' }));
      }
      router.push('/quiz/psychology-books');
    }, 300);
  };

  const handleYes = () => {
    setSelectedButton('yes');
    setTimeout(() => {
      setShowInput(true);
      setShouldAutoFocus(true);
      setSelectedButton(null);
    }, 300);
  };

  const handleMicClick = () => {
    setIsRecording(!isRecording);
  };

  const handleContinue = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('psychiatricConditions', JSON.stringify({ 
        hasConditions: true, 
        details: customValue.trim() 
      }));
    }
    router.push('/quiz/psychology-books');
  };

  // Click outside handler (except Continue button)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideInput = customInputRef.current?.contains(target);
      const clickedContinue = continueBtnRef.current?.contains(target);
      if (!clickedInsideInput && !clickedContinue) {
        setShowInput(false);
        setIsRecording(false);
        setShouldAutoFocus(false);
      }
    };

    if (showInput) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showInput]);

  // Scroll up when Continue button appears (only when collapsing input, not during typing)
  useEffect(() => {
    const hasText = customValue.trim();
    // Only scroll when collapsing expanded input, not during active typing
    if (hasText && !showInput) {
      // Use a debounce to avoid scrolling on every keystroke
      const timeoutId = setTimeout(() => {
        const footer = document.querySelector('footer');
        if (footer && !showInput) {
          footer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 300); // Debounce to avoid scrolling during typing
      
      return () => clearTimeout(timeoutId);
    }
  }, [showInput]); // Removed customValue from dependencies to prevent scroll on every keystroke

  // Hide footer when expanded, show floating button instead
  useEffect(() => {
    const footer = document.querySelector('footer') as HTMLElement | null;
    if (!footer) return;

    if (showInput) {
      footer.style.display = 'none';
    } else {
      footer.style.display = '';
    }

    return () => {
      footer.style.display = '';
    };
  }, [showInput]);

  const footerContent = !showInput ? (
    <div ref={footerRef} className="max-w-md mx-auto w-full">
      {/* Yes/No Buttons */}
      <div className="flex gap-4 w-full">
        {/* Yes Button */}
        <button
          onClick={handleYes}
          onTouchEnd={(e) => { e.preventDefault(); handleYes(); }}
          className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm select-none ${
            selectedButton === 'yes'
              ? 'border-[#6B9D47] bg-[#6B9D47]/10'
              : 'bg-white border-gray-300 hover:border-[#6B9D47] hover:bg-[#6B9D47]/10'
          }`}
        >
          <span className="text-2xl sm:text-3xl mb-1">👍</span>
          <span className="text-sm sm:text-base font-medium text-gray-700">
            Yes
          </span>
        </button>

        {/* No Button */}
        <button
          onClick={handleNo}
          onTouchEnd={(e) => { e.preventDefault(); handleNo(); }}
          className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm select-none ${
            selectedButton === 'no'
              ? 'border-[#6B9D47] bg-[#6B9D47]/10'
              : 'bg-white border-gray-300 hover:border-[#6B9D47] hover:bg-[#6B9D47]/10'
          }`}
        >
          <span className="text-2xl sm:text-3xl mb-1">👎</span>
          <span className="text-sm sm:text-base font-medium text-gray-700">
            No
          </span>
        </button>
      </div>
    </div>
  ) : null;

  return (
    <QuizLayout
      currentStep={CURRENT_STEP}
      totalSteps={TOTAL_STEPS}
      footer={footerContent}
      className="px-4 sm:px-6 md:px-8 lg:px-10"
    >
      <div className="max-w-[660px] w-full mx-auto pt-[30px]">
        {/* Title */}
        <div className="mb-3 sm:mb-4 mt-4 sm:mt-6 text-center">
          <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 leading-tight max-w-[540px] mx-auto [zoom:110%]:text-[min(4vw,2.5rem)] [zoom:125%]:text-[min(3.5vw,2rem)] [zoom:150%]:text-[min(3vw,1.75rem)]">
            Have you been diagnosed with any psychiatric conditions?
          </h1>
        </div>

        {/* Description */}
        <div className="mb-6 sm:mb-8 text-center">
          <p className="text-gray-600 text-base sm:text-lg md:text-xl [zoom:110%]:text-[min(3vw,1.25rem)] [zoom:125%]:text-[min(2.5vw,1.1rem)] [zoom:150%]:text-[min(2vw,1rem)]">
            Understanding your mental health history allows us to personalize your journey.
          </p>
        </div>

        {/* Avocado Image */}
        <div className="flex justify-center mb-6">
          <Image
            src="/psychiatric-conditions-avocado.png"
            alt="Avocado with Theater Mask"
            width={500}
            height={500}
            className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] max-w-[45vh] max-h-[45vh] object-contain"
          />
        </div>

        {/* Custom Input Field - Shows when Yes is clicked */}
        {showInput && (
          <div ref={customInputRef} className="w-full max-w-md mx-auto mb-0">
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
                placeholder={isRecording ? "Speak please..." : "Tell us about your conditions..."}
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
          </div>
        )}
      </div>

      {/* Floating Continue Button - appears when custom field is expanded, always visible and active */}
      {showInput && (
        <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-1 pt-2 bg-[#f5f5f0] animate-slide-up">
          <div className="max-w-sm mx-auto w-full">
            <button
              ref={continueBtnRef}
              type="button"
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

