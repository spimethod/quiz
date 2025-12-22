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
  const CURRENT_STEP = 23;
  const TOTAL_STEPS = 32;

  const goalOptions = [
    'Support',
    'Stress relief',
    'Better sleep',
    'Mood boost',
    'Motivation',
    'Relaxation',
    'Self-awareness',
    'Confidence',
    'Cognitive tools',
    'Focus'
  ];

  const handleSelect = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleAddCustom = () => {
    if (customValue.trim()) {
      setSelectedOptions([...selectedOptions, customValue.trim()]);
      setCustomValue('');
      setIsExpanded(false);
      setIsRecording(false);
      setShouldAutoFocus(false);
      // Scroll down after closing to show the title
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
      if (customInputRef.current && !customInputRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setIsRecording(false);
        setShouldAutoFocus(false);
        // Scroll down after closing to show the title
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
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
        className={`w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 select-none ${
          selectedOptions.length > 0 || customValue.trim()
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
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6">
          {goalOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              onTouchEnd={(e) => { e.preventDefault(); handleSelect(option); }}
              className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 active:scale-95 select-none ${
                selectedOptions.includes(option)
                  ? 'bg-[#6B9D47] text-white shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#6B9D47]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Custom Input - Collapsed/Expanded (same behavior as feelings step) */}
        <div ref={customInputRef} className="w-full max-w-md mx-auto">
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
                onFocus={() => {
                  setIsExpanded(true);
                  setShouldAutoFocus(true);
                  // При фокусе на input микрофон НЕ включается
                }}
                onClick={() => {
                  setIsExpanded(true);
                  setShouldAutoFocus(true);
                  // При клике на input микрофон НЕ включается  
                }}
                placeholder="+ Add Your Own"
                className="flex-1 bg-transparent outline-none text-sm sm:text-base text-gray-700 placeholder-gray-400 cursor-text"
              />
              <button
                onClick={() => {
                  setIsExpanded(true);
                  setIsRecording(true); // При клике на кнопку микрофон включается
                  setShouldAutoFocus(false); // Не фокусируем textarea, чтобы не выключился микрофон
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