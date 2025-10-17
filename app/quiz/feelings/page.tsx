'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Total steps before email capture
const TOTAL_STEPS = 12;
const CURRENT_STEP = 4;

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
  const [isAddYourOwnActive, setIsAddYourOwnActive] = useState(false);
  const [customValue, setCustomValue] = useState('');

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
      setShowCustomInput(false);
    }
  };

  const handleContinue = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userFeelings', JSON.stringify(selectedOptions));
    }
    // Navigate to overall feeling page
    router.push('/quiz/overall');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f0] animate-fadeIn">
      {/* Header with Logo and Progress */}
      <header className="flex-shrink-0 pt-2 sm:pt-4 pb-0 px-8 sm:px-10 md:px-12 lg:px-6 relative">
        {/* Back Arrow */}
        <button
          onClick={() => router.back()}
          className="absolute left-8 sm:left-20 md:left-40 lg:left-52 top-3 sm:top-5 p-1.5 sm:p-2 hover:bg-gray-200 rounded-full transition-all duration-200 hover:scale-110 z-10"
          aria-label="Go back"
        >
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-800" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex flex-col items-center" style={{ marginLeft: '-30px' }}>
          <div className="flex justify-center mb-1 sm:mb-2">
            <Image
              src="/avocado-logo.png"
              alt="Avocado"
              width={280}
              height={90}
              priority
              className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto"
            />
          </div>
          <div className="text-center ml-0 sm:ml-5">
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium">Step {CURRENT_STEP} of {TOTAL_STEPS}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="overflow-y-auto overflow-x-hidden px-4 pb-4 sm:px-6 md:px-8 lg:flex-1 lg:pb-32 lg:px-10">
        <div className="max-w-[660px] w-full mx-auto">
          {/* Title */}
          <div className="mb-3 sm:mb-4 mt-4 sm:mt-6 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight [zoom:110%]:text-[min(4vw,2.5rem)] [zoom:125%]:text-[min(3.5vw,2rem)] [zoom:150%]:text-[min(3vw,1.75rem)]">
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
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {predefinedOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-200 [zoom:110%]:text-[min(2.5vw,1.1rem)] [zoom:110%]:px-3.5 [zoom:110%]:py-2.5 [zoom:125%]:text-[min(2.2vw,1rem)] [zoom:125%]:px-3 [zoom:125%]:py-2 [zoom:150%]:text-[min(2vw,0.9rem)] [zoom:150%]:px-2.5 [zoom:150%]:py-1.5 ${
                    selectedOptions.includes(option)
                      ? 'bg-[#6B9D47] text-white shadow-md scale-105'
                      : 'bg-white text-gray-800 border border-gray-300 hover:border-[#6B9D47] hover:scale-105'
                  }`}
                >
                  {option}
                </button>
              ))}
              
              {/* Add Your Own Button */}
              <button
                onClick={() => setIsAddYourOwnActive(!isAddYourOwnActive)}
                className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-200 flex items-center gap-2 [zoom:110%]:text-[min(2.5vw,1rem)] [zoom:110%]:px-3 [zoom:110%]:py-2 ${
                  isAddYourOwnActive
                    ? 'bg-[#6B9D47] text-white shadow-md scale-105'
                    : 'bg-white text-[#6B9D47] border-2 border-[#6B9D47] hover:bg-[#6B9D47] hover:text-white hover:scale-105'
                }`}
              >
                <span className="text-lg">+</span>
                <span>Add Your Own</span>
              </button>
            </div>

            {/* Custom Input Field */}
            {isAddYourOwnActive && (
              <div className="mt-4 mb-20">
                <textarea
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="Type please..."
                  className="w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] mx-4 sm:mx-6 px-4 py-3 rounded-xl border-2 border-[#6B9D47] focus:outline-none focus:ring-2 focus:ring-[#6B9D47] text-sm sm:text-base resize-none h-[72px] [zoom:110%]:text-[min(2.5vw,1.1rem)] [zoom:110%]:h-[min(9vh,68px)] [zoom:125%]:text-[min(2.2vw,1rem)] [zoom:125%]:h-[min(8vh,64px)] [zoom:150%]:text-[min(2vw,0.9rem)] [zoom:150%]:h-[min(7vh,56px)]"
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer with Continue Button */}
      <footer className="px-8 sm:px-12 pb-8 lg:fixed lg:bottom-0 lg:left-0 lg:right-0 lg:px-6 lg:pb-10 lg:bg-[#f5f5f0] [zoom:110%]:pb-[min(5vh,28px)] [zoom:125%]:pb-[min(4vh,24px)] [zoom:150%]:pb-[min(3vh,20px)]">
        <div className="max-w-sm mx-auto">
          <button
            onClick={handleContinue}
            disabled={selectedOptions.length === 0 && !customValue.trim()}
            className={`w-full font-semibold text-base sm:text-lg md:text-xl py-2.5 sm:py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 ${
              selectedOptions.length === 0 && !customValue.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
            }`}
          >
            Continue
          </button>
        </div>
      </footer>
    </div>
  );
}

