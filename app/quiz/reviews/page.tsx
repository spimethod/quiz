'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BackButton from '../../components/BackButton';
import { getProgressPercentage } from '../../utils/progress';

export default function ReviewsPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const CURRENT_STEP = 1; 
  const TOTAL_STEPS = 12;

  const handleContinue = () => {
    router.push('/quiz/age');
  };

  return (
    <div
      ref={containerRef}
      data-reviews="true"
      className="flex flex-col bg-[#f5f5f0] portrait:fixed portrait:inset-0 portrait:overflow-hidden landscape:min-h-screen landscape:overflow-y-auto landscape:overflow-x-hidden"
      style={{
        overscrollBehavior: 'none'
      }}
    >
      {/* Portrait mode: disable touch scroll */}
      <style jsx>{`
        @media (orientation: portrait) {
          div[data-reviews="true"] {
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
      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-4">
        <div className="max-w-md w-full mx-auto flex flex-col items-center">
          
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#1a1a1a] leading-tight mb-3 px-2">
            People worldwide use<br />Avocado to feel better<br />day after day
          </h1>

          {/* Subtitle */}
          <p className="text-center text-gray-600 text-sm mb-3 px-4 leading-relaxed">
            Over 100,000 users practice daily toward inner balance with an AI companion
          </p>

          {/* Review Card Image */}
          <div className="relative w-full portrait:h-[45vh] landscape:h-[40vh] max-w-[85%] mb-2">
            <Image
              src="/review-card.png"
              alt="User Review"
              fill
              className="object-contain"
              priority
            />
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
