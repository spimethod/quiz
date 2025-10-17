'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function GoalsPage() {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [customValue, setCustomValue] = useState('');
  const [isAddYourOwnActive, setIsAddYourOwnActive] = useState(false);
  const CURRENT_STEP = 12;
  const TOTAL_STEPS = 12;

  const goalOptions = [
    'Support',
    'Stress relief',
    'Better sleep',
    'Mood boost',
    'Motivation',
    'Relaxation',
    'Self-awareness',
    'Cognitive tools',
    'Focus',
    'Confidence'
  ];

  const handleSelect = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleAddYourOwn = () => {
    setIsAddYourOwnActive(!isAddYourOwnActive);
  };

  const handleContinue = () => {
    if (selectedOptions.length > 0 || customValue.trim()) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('goals', JSON.stringify({
          selected: selectedOptions,
          custom: customValue.trim()
        }));
      }
      router.push('/quiz/before-after');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f0] overflow-hidden animate-fadeIn">
      {/* Header */}
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
      <main className="flex-grow-0 px-4 sm:px-6 md:px-8 lg:px-10 lg:pb-24">
        <div className="max-w-[660px] w-full mx-auto">
          {/* Title */}
          <div className="mb-3 sm:mb-4 mt-4 sm:mt-6 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight max-w-[540px] mx-auto [zoom:110%]:text-[min(4vw,2.5rem)] [zoom:125%]:text-[min(3.5vw,2rem)] [zoom:150%]:text-[min(3vw,1.75rem)]">
              What's your main goal with Avocado?
            </h1>
          </div>

          {/* Description */}
          <div className="mb-8 sm:mb-10 text-center">
            <p className="text-gray-600 text-base sm:text-lg md:text-xl [zoom:110%]:text-[min(3vw,1.25rem)] [zoom:125%]:text-[min(2.5vw,1.1rem)] [zoom:150%]:text-[min(2vw,1rem)]">
              Let's find out what matters most to you, so I can support you in the best way!
            </p>
          </div>

          {/* Avocado Image */}
          <div className="flex justify-center mb-8">
            <Image
              src="/goals-avocado.png"
              alt="Goals Avocado"
              width={400}
              height={400}
              className="w-48 h-48 sm:w-52 sm:h-52 md:w-60 md:h-60 max-w-[34vh] max-h-[34vh] object-contain [zoom:110%]:w-[min(24vh,220px)] [zoom:110%]:h-[min(24vh,220px)] [zoom:125%]:w-[min(22vh,200px)] [zoom:125%]:h-[min(22vh,200px)] [zoom:150%]:w-[min(20vh,180px)] [zoom:150%]:h-[min(20vh,180px)]"
            />
          </div>

          {/* Goal Options */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6">
            {goalOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                  selectedOptions.includes(option)
                    ? 'bg-[#6B9D47] text-white shadow-md'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#6B9D47]'
                }`}
              >
                {option}
              </button>
            ))}
            {/* Add Your Own Button */}
            <button
              onClick={handleAddYourOwn}
              className="px-4 py-2 rounded-full text-sm sm:text-base font-medium bg-white text-[#6B9D47] border-2 border-[#6B9D47] hover:bg-[#6B9D47] hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
            >
              + Add Your Own
            </button>
          </div>

          {/* Custom Input Field */}
          {isAddYourOwnActive && (
            <div className="mb-20 sm:mb-24">
              <textarea
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Type please..."
                rows={2}
                className="w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] mx-4 sm:mx-6 px-4 py-3 rounded-xl border-2 border-[#6B9D47] focus:outline-none focus:ring-2 focus:ring-[#6B9D47] text-sm sm:text-base resize-none h-[72px] [zoom:110%]:text-[min(2.5vw,1.1rem)] [zoom:110%]:h-[min(9vh,68px)] [zoom:125%]:text-[min(2.2vw,1rem)] [zoom:125%]:h-[min(8vh,64px)] [zoom:150%]:text-[min(2vw,0.9rem)] [zoom:150%]:h-[min(7vh,56px)]"
                autoFocus
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer with Continue Button */}
      <footer className="pb-6 lg:fixed lg:bottom-0 lg:left-0 lg:right-0 lg:bg-[#f5f5f0] lg:pt-4 lg:pb-6">
        <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4rem)] max-w-sm mx-auto">
          <button
            onClick={handleContinue}
            disabled={selectedOptions.length === 0 && !customValue.trim()}
            className={`w-full font-semibold text-base sm:text-lg md:text-xl py-2.5 sm:py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 ${
              selectedOptions.length > 0 || customValue.trim()
                ? 'bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </footer>
    </div>
  );
}
