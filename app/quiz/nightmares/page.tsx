'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BackButton from '../../components/BackButton';
import { getProgressPercentage } from '../../utils/progress';

export default function NightmaresPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedButton, setSelectedButton] = useState<'yes' | 'no' | null>(null);
  const CURRENT_STEP = 13;
  const TOTAL_STEPS = 32;

  const handleSelect = (option: 'yes' | 'no') => {
    setSelectedButton(option);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('nightmares', option);
      }
      router.push('/quiz/support-system');
    }, 300);
  };

  return (
    <div
      ref={containerRef}
      data-nightmares="true"
      className="flex flex-col bg-[#f5f5f0] portrait:fixed portrait:inset-0 portrait:overflow-hidden landscape:min-h-screen landscape:overflow-y-auto landscape:overflow-x-hidden"
      style={{
        overscrollBehavior: 'none'
      }}
    >
      {/* Portrait mode: disable touch scroll */}
      <style jsx>{`
        @media (orientation: portrait) {
          div[data-nightmares="true"] {
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
          <div className="mb-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight px-2">
              Do nightmares often disturb your sleep?
            </h1>
          </div>

          {/* Description */}
          <div className="mb-12 text-center">
            <p className="text-gray-600 text-sm px-2">
              Recurring nightmares can impact your emotional state. Let us know if this is something you struggle with.
            </p>
          </div>

          {/* Avocado Image */}
          <div className="flex justify-center mb-2">
            <Image
              src="/nightmare-avocado.png"
              alt="Crying Avocado with Nightmare"
              width={500}
              height={500}
              className="portrait:h-[35vh] landscape:h-[30vh] w-auto object-contain"
              priority
            />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 pb-6 pt-3 bg-[#f5f5f0]">
        <div className="flex gap-4 w-full max-w-md mx-auto">
          {/* Yes Button */}
          <button
            onClick={() => handleSelect('yes')}
            onTouchEnd={(e) => { e.preventDefault(); handleSelect('yes'); }}
            className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm select-none ${
              selectedButton === 'yes'
                ? 'border-[#6B9D47] bg-[#6B9D47]/10'
                : 'bg-white border-gray-300 hover:border-[#6B9D47] hover:bg-[#6B9D47]/10'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            <span className="text-2xl sm:text-3xl mb-1">👍</span>
            <span className="text-sm sm:text-base font-medium text-gray-700">
              Yes
            </span>
          </button>

          {/* No Button */}
          <button
            onClick={() => handleSelect('no')}
            onTouchEnd={(e) => { e.preventDefault(); handleSelect('no'); }}
            className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm select-none ${
              selectedButton === 'no'
                ? 'border-[#6B9D47] bg-[#6B9D47]/10'
                : 'bg-white border-gray-300 hover:border-[#6B9D47] hover:bg-[#6B9D47]/10'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            <span className="text-2xl sm:text-3xl mb-1">👎</span>
            <span className="text-sm sm:text-base font-medium text-gray-700">
              No
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
}