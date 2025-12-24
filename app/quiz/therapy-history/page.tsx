'use client';

import { useState, useRef, type MouseEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BackButton from '../../components/BackButton';
import { getProgressPercentage } from '../../utils/progress';

export default function TherapyHistoryPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const CURRENT_STEP = 17;
  const TOTAL_STEPS = 32;

  const options = [
    'Psychologist',
    'Psychiatrist',
    'Not yet'
  ];

  const handleSelect = (e: MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const option = e.currentTarget.getAttribute('data-option');
    if (option) {
      setSelected(option);
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('therapyHistory', option);
        }
        router.push('/quiz/medical-conditions');
      }, 300);
    }
  };

  return (
    <div
      ref={containerRef}
      data-therapy="true"
      className="flex flex-col bg-[#f5f5f0] portrait:fixed portrait:inset-0 portrait:overflow-hidden landscape:min-h-screen landscape:overflow-y-auto landscape:overflow-x-hidden"
      style={{
        overscrollBehavior: 'none'
      }}
    >
      {/* Portrait mode: disable touch scroll */}
      <style jsx>{`
        @media (orientation: portrait) {
          div[data-therapy="true"] {
            touch-action: none;
          }
        }
      `}</style>

      {/* Header */}
      <header className="pt-[12px] pb-0 px-8 bg-[#f5f5f0] relative z-10">
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
      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-4">
        <div className="max-w-md w-full mx-auto flex flex-col items-center">
          
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight px-2">
              Have you worked with anyone before to support your mental health?
            </h1>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-4 w-full">
            {options.map((option) => (
              <button
                key={option}
                data-option={option}
                onClick={handleSelect}
                onTouchEnd={handleSelect}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 select-none ${
                  selected === option
                    ? 'border-[#6B9D47] bg-[#6B9D47]/10'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                <span className={`text-base sm:text-lg font-medium ${
                  selected === option ? 'text-[#6B9D47]' : 'text-gray-700'
                }`}>
                  {option}
                </span>
                {/* Radio circle */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selected === option
                    ? 'border-[#6B9D47]'
                    : 'border-gray-300'
                }`}>
                  {selected === option && (
                    <div className="w-3 h-3 rounded-full bg-[#6B9D47]" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Avocado Image */}
          <div className="flex justify-center mb-2">
            <Image
              src="/therapy-avocado.png"
              alt="Avocado on Therapy Couch"
              width={500}
              height={500}
              className="portrait:h-[30vh] landscape:h-[28vh] w-auto object-contain"
              priority
            />
          </div>

        </div>
      </main>
    </div>
  );
}
