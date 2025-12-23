'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BackButton from '../../components/BackButton';
import { getProgressPercentage } from '../../utils/progress';

// Total steps before email capture
const TOTAL_STEPS = 12;
const CURRENT_STEP = 10;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedValue, setSelectedValue] = useState(5);

  const handleSelect = (value: number) => {
    setSelectedValue(value);
  };

  const handleContinue = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('overallFeeling', selectedValue.toString());
    }
    router.push('/quiz/doing-amazing');
  };

  return (
    <div
      ref={containerRef}
      data-overall="true"
      className="flex flex-col bg-[#f5f5f0] portrait:fixed portrait:inset-0 portrait:overflow-hidden landscape:min-h-screen landscape:overflow-y-auto landscape:overflow-x-hidden"
      style={{
        overscrollBehavior: 'none'
      }}
    >
      {/* Portrait mode: disable touch scroll but allow button interaction */}
      <style jsx>{`
        @media (orientation: portrait) {
          div[data-overall="true"] {
            touch-action: none;
          }
        }
      `}</style>

      {/* Header */}
      <header className="pt-2 pb-0 px-8 bg-[#f5f5f0] relative z-10">
        <BackButton 
          className="absolute left-8 top-3 z-10"
        />
        
        <div className="flex flex-col items-center" style={{ marginLeft: '-30px' }}>
          <div className="flex justify-center mb-1">
            <Image
              src="/avocado-logo.png"
              alt="Avocado"
              width={280}
              height={90}
              priority
              className="h-8 w-auto"
            />
          </div>
          {/* Progress Bar */}
          <div className="w-32 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-[#6B9D47] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${getProgressPercentage(CURRENT_STEP)}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-2">
        <div className="max-w-md w-full mx-auto flex flex-col items-center">
          {/* Title */}
          <div className="mb-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              Let's check in — how are you feeling overall?
            </h1>
          </div>

          {/* Subtitle */}
          <div className="mb-3 text-center">
            <p className="text-sm text-gray-600 px-2">
              Your answer helps me support you better. Be honest — there's no right or wrong way to feel!
            </p>
          </div>

          {/* Selected State */}
          <div className="mb-4 text-center">
            <p className="text-base sm:text-lg text-gray-800 font-medium px-2">
              {feelingOptions.find(option => option.value === selectedValue)?.text}
            </p>
          </div>

          {/* Feeling Scale - with touch-action for buttons */}
          <div className="mb-4 flex justify-center gap-2" style={{ touchAction: 'manipulation' }}>
            {feelingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                onTouchEnd={(e) => { e.preventDefault(); handleSelect(option.value); }}
                className={`w-9 h-9 rounded-full transition-all duration-200 hover:scale-110 select-none ${
                  selectedValue === option.value ? 'ring-4 ring-offset-2 ring-gray-300' : ''
                }`}
                style={{ 
                  backgroundColor: option.color,
                  touchAction: 'manipulation'
                }}
                aria-label={`Feeling level ${option.value}`}
              />
            ))}
          </div>

          {/* Avocado Image */}
          <div className="flex justify-center mb-2">
            <div className="relative portrait:h-[28vh] landscape:h-[25vh] w-[240px]">
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

      {/* Footer */}
      <footer className="px-4 pb-6 pt-3 bg-[#f5f5f0]">
        <div className="max-w-md mx-auto w-full flex justify-center">
          <button
            onClick={handleContinue}
            onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
            className="w-full font-semibold text-lg py-3 px-8 rounded-xl transition-all duration-300 bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer select-none"
          >
            Continue
          </button>
        </div>
      </footer>
    </div>
  );
}