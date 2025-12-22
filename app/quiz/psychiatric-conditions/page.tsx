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
  const customInputRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const CURRENT_STEP = 19;
  const TOTAL_STEPS = 32;

  const handleNo = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('psychiatricConditions', JSON.stringify({ hasConditions: false, details: '' }));
    }
    router.push('/quiz/psychology-books');
  };

  const handleYes = () => {
    setShowInput(true);
    setShouldAutoFocus(true);
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

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideInput = customInputRef.current && !customInputRef.current.contains(target);
      const isOutsideFooter = footerRef.current && !footerRef.current.contains(target);
      
      if (isOutsideInput && isOutsideFooter) {
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

  // Scroll into view when expanded
  useEffect(() => {
    if (showInput && customInputRef.current) {
      setTimeout(() => {
        customInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [showInput]);

  const footerContent = (
    <div ref={footerRef} className="max-w-md mx-auto w-full">
      {!showInput ? (
        // Yes/No Buttons
        <div className="flex gap-4 w-full">
          {/* Yes Button */}
          <button
            type="button"
            onClick={handleYes}
            onTouchEnd={(e) => { e.preventDefault(); handleYes(); }}
            className="flex-1 flex flex-col items-center justify-center py-3 rounded-xl bg-white border-2 border-gray-300 hover:border-[#6B9D47] hover:bg-[#f0fdf4] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm select-none"
          >
            <span className="text-2xl sm:text-3xl mb-1">👍</span>
            <span className="text-sm sm:text-base font-medium text-gray-700">
              Yes
            </span>
          </button>

          {/* No Button */}
          <button
            type="button"
            onClick={handleNo}
            onTouchEnd={(e) => { e.preventDefault(); handleNo(); }}
            className="flex-1 flex flex-col items-center justify-center py-3 rounded-xl bg-white border-2 border-gray-300 hover:border-[#6B9D47] hover:bg-[#f0fdf4] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm select-none"
          >
            <span className="text-2xl sm:text-3xl mb-1">👎</span>
            <span className="text-sm sm:text-base font-medium text-gray-700">
              No
            </span>
          </button>
        </div>
      ) : (
        // Continue Button
        <button
          type="button"
          onClick={handleContinue}
          onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
          className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer select-none"
        >
          Continue
        </button>
      )}
    </div>
  );

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
          <div ref={customInputRef} className="w-full max-w-md mx-auto mb-6">
            <div className={`relative border-2 ${customValue.trim() ? 'border-[#6B9D47]' : 'border-gray-300'} rounded-3xl p-4 bg-white`}>
              <textarea
                value={customValue}
                onChange={(e) => {
                  setCustomValue(e.target.value);
                  if (isRecording) setIsRecording(false);
                }}
                onFocus={() => {
                  if (isRecording) setIsRecording(false);
                }}
                placeholder={isRecording ? "Speak please..." : "Tell us about your conditions..."}
                className="w-full h-32 bg-transparent outline-none resize-none overflow-y-auto pr-14 text-sm sm:text-base text-gray-700 placeholder-gray-400"
                autoFocus={shouldAutoFocus}
              />
              {/* Microphone button - bottom right corner */}
              <button
                type="button"
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
          </div>
        )}
      </div>
    </QuizLayout>
  );
}

