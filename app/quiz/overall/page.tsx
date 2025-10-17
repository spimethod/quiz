'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Total steps before email capture
const TOTAL_STEPS = 12;
const CURRENT_STEP = 5;

const feelingOptions = [
  { 
    color: '#E74C3C',
    value: 1,
    text: "I'm really struggling right now"
  },
  { 
    color: '#EC7063',
    value: 2,
    text: "Things are pretty hard lately"
  },
  { 
    color: '#E67E22',
    value: 3,
    text: "I'm feeling low, but trying my best"
  },
  { 
    color: '#F1C40F',
    value: 4,
    text: "Some ups and downs lately"
  },
  { 
    color: '#F7DC6F',
    value: 5,
    text: "I'm managing, but there's room for improvement"
  },
  { 
    color: '#6B9D47',
    value: 6,
    text: "I'm doing alright, could be better"
  },
  { 
    color: '#82C553',
    value: 7,
    text: "I'm in a good place right now"
  },
  { 
    color: '#2E7D32',
    value: 8,
    text: "I'm feeling great and balanced!"
  },
  { 
    color: '#1B5E20',
    value: 9,
    text: "I'm feeling fantastic and full of energy!"
  }
];

export default function OverallPage() {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState(5);

  const handleSelect = (value: number) => {
    setSelectedValue(value);
  };

  const handleContinue = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('overallFeeling', selectedValue.toString());
    }
    // Navigate to next page
    router.push('/quiz/doing-amazing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f0] animate-fadeIn overflow-hidden">
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
      <main className="flex-grow-0 px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="max-w-[660px] w-full mx-auto">
          {/* Title */}
          <div className="mb-3 sm:mb-4 mt-4 sm:mt-6 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight [zoom:110%]:text-[min(4vw,2.5rem)] [zoom:125%]:text-[min(3.5vw,2rem)] [zoom:150%]:text-[min(3vw,1.75rem)]">
              Let's check in — how are you feeling overall?
            </h1>
          </div>

          {/* Subtitle */}
          <div className="mb-4 sm:mb-6 text-center">
            <p className="text-sm sm:text-base text-gray-600 max-w-[540px] mx-auto [zoom:110%]:text-[min(2.5vw,1.1rem)] [zoom:125%]:text-[min(2.2vw,1rem)] [zoom:150%]:text-[min(2vw,0.9rem)]">
              Your answer helps me support you better. Be honest — there's no right or wrong way to feel!
            </p>
          </div>

          {/* Selected State */}
          <div className="mb-6 sm:mb-8 mt-12 sm:mt-16 text-center">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-800 font-medium [zoom:110%]:text-[min(3vw,1.75rem)] [zoom:125%]:text-[min(2.8vw,1.5rem)] [zoom:150%]:text-[min(2.5vw,1.25rem)]">
              {feelingOptions.find(option => option.value === selectedValue)?.text}
            </p>
          </div>

          {/* Feeling Scale */}
          <div className="mb-12 sm:mb-16 flex justify-center gap-2 sm:gap-3">
            {feelingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-200 hover:scale-110 ${
                  selectedValue === option.value ? 'ring-4 ring-offset-2 ring-gray-300' : ''
                }`}
                style={{ backgroundColor: option.color }}
                aria-label={`Feeling level ${option.value}`}
              />
            ))}
          </div>

          {/* Avocado Image */}
          <div className="flex justify-center mb-8">
              <div className="relative w-56 h-56 sm:w-60 sm:h-60 md:w-72 md:h-72 max-w-[38vh] max-h-[38vh] [zoom:110%]:w-[min(25vh,240px)] [zoom:110%]:h-[min(25vh,240px)] [zoom:125%]:w-[min(22vh,220px)] [zoom:125%]:h-[min(22vh,220px)] [zoom:150%]:w-[min(20vh,200px)] [zoom:150%]:h-[min(20vh,200px)]">
              <Image
                src="/doctor-avocado.png"
                alt="Doctor Avocado"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Continue Button */}
      <footer className="pb-6">
        <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4rem)] max-w-sm mx-auto">
          <button
            onClick={handleContinue}
            className="w-full font-semibold text-base sm:text-lg md:text-xl py-2.5 sm:py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            Continue
          </button>
        </div>
      </footer>
    </div>
  );
}
