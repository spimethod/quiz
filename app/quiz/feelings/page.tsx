'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QuizLayout from '../../components/QuizLayout';

// Total steps before email capture
const TOTAL_STEPS = 12;
const CURRENT_STEP = 6;

const predefinedOptions = [
  'Sleep issues',
  'Burnout',
  'Depression',
  'Negative thoughts',
  'Lack of focus',
  'Procrastination',
  'Social anxiety',
  'Loneliness',
  'Low self-esteem',
];

export default function FeelingsPage() {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [customValue, setCustomValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [shouldAutoFocus, setShouldAutoFocus] = useState(false);
  const customInputRef = useRef<HTMLDivElement>(null);
  const continueBtnRef = useRef<HTMLButtonElement>(null);

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleAddCustom = () => {
    if (customValue.trim()) {
      setSelectedOptions([...selectedOptions, customValue.trim()]);
      setCustomValue('');
      setIsRecording(false);
      setShouldAutoFocus(false);
    }
  };

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    // Здесь будет логика голосового ввода
  };

  const handleContinue = () => {
    if (typeof window !== 'undefined') {
      // Include custom value if entered but not yet added
      const allFeelings = customValue.trim() 
        ? [...selectedOptions, customValue.trim()]
        : selectedOptions;
      localStorage.setItem('userFeelings', JSON.stringify(allFeelings));
    }
    // Do not collapse custom input on submit; keep current expanded state
    router.push('/quiz/pace');
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideInput = customInputRef.current?.contains(target);
      const clickedContinue = continueBtnRef.current?.contains(target);
      if (!clickedInsideInput && !clickedContinue) {
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
        onTouchEnd={(e) => { if (selectedOptions.length > 0 || customValue.trim()) { e.preventDefault(); handleContinue(); } }}
        disabled={selectedOptions.length === 0 && !customValue.trim()}
        ref={continueBtnRef}
        className={`w-full font-semibold text-base sm:text-lg md:text-xl py-2.5 sm:py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 select-none ${
          selectedOptions.length === 0 && !customValue.trim()
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
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
      <div className="max-w-[660px] w-full mx-auto">
        {/* Title */}
        <div className="mb-3 sm:mb-4 mt-4 sm:mt-6 text-center">
          <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 leading-tight [zoom:110%]:text-[min(4vw,2.5rem)] [zoom:125%]:text-[min(3.5vw,2rem)] [zoom:150%]:text-[min(3vw,1.75rem)]">
            Have you noticed any feelings or challenges in the past three months?
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mb-4 sm:mb-6 text-center">
          <p className="text-sm sm:text-base text-gray-600 max-w-[660px] mx-auto [zoom:110%]:text-[min(2.5vw,1.1rem)] [zoom:125%]:text-[min(2.2vw,1rem)] [zoom:150%]:text-[min(2vw,0.9rem)]">
            Awareness is the first step to feeling better. Let's check in with how you've been
          </p>
        </div>

        {/* Avocado Image */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="relative w-56 h-56 sm:w-60 sm:h-60 md:w-72 md:h-72 max-w-[38vh] max-h-[38vh] [zoom:110%]:w-[min(25vh,240px)] [zoom:110%]:h-[min(25vh,240px)] [zoom:125%]:w-[min(22vh,220px)] [zoom:125%]:h-[min(22vh,220px)] [zoom:150%]:w-[min(20vh,200px)] [zoom:150%]:h-[min(20vh,200px)]">
            <Image
              src="/feelings-bg.png"
              alt="Feelings Avocado"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Options Grid */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-4">
            {predefinedOptions.map((option) => (
              <button
                key={option}
                onClick={() => toggleOption(option)}
                onTouchEnd={(e) => { e.preventDefault(); toggleOption(option); }}
                className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-200 select-none [zoom:110%]:text-[min(2.5vw,1.1rem)] [zoom:110%]:px-3.5 [zoom:110%]:py-2.5 [zoom:125%]:text-[min(2.2vw,1rem)] [zoom:125%]:px-3 [zoom:125%]:py-2 [zoom:150%]:text-[min(2vw,0.9rem)] [zoom:150%]:px-2.5 [zoom:150%]:py-1.5 ${
                  selectedOptions.includes(option)
                    ? 'bg-[#6B9D47] text-white shadow-md scale-105'
                    : 'bg-white text-gray-800 border border-gray-300 hover:border-[#6B9D47] hover:scale-105'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Custom Input - Collapsed/Expanded */}
          <div ref={customInputRef} className="w-full max-w-md mx-auto">
            {!isExpanded ? (
              /* Collapsed: Input + Button in one line */
            <div 
              className={`flex items-center gap-2 border-2 ${customValue.trim() ? 'border-[#6B9D47]' : 'border-gray-300'} rounded-full px-4 py-2.5 bg-white cursor-text`}
            >
                <input
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                onFocus={() => {
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
      </div>
    </QuizLayout>
  );
}
