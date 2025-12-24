'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BackButton from '../../components/BackButton';
import { getProgressPercentage } from '../../utils/progress';

export default function CommunityPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const CURRENT_STEP = 24;
  const TOTAL_STEPS = 32;

  const handleContinue = () => {
    router.push('/quiz/name');
  };

  return (
    <div
      ref={containerRef}
      data-community="true"
      className="flex flex-col bg-[#f5f5f0] portrait:fixed portrait:inset-0 portrait:overflow-hidden landscape:min-h-screen landscape:overflow-y-auto landscape:overflow-x-hidden"
      style={{
        overscrollBehavior: 'none'
      }}
    >
      {/* Portrait mode: disable touch scroll */}
      <style jsx>{`
        @media (orientation: portrait) {
          div[data-community="true"] {
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
      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-8">
        <div className="max-w-md w-full flex justify-center">
          <Image
            src="/community-reviews.png"
            alt="Community Reviews"
            width={600}
            height={600}
            className="w-full max-w-[85%] portrait:h-[55vh] landscape:h-[50vh] object-contain"
            priority
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 pb-6 pt-3 bg-[#f5f5f0]">
        <div className="max-w-md mx-auto w-full flex justify-center">
          <button
            onClick={handleContinue}
            onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
            className="w-full font-semibold text-lg py-3 px-8 rounded-xl bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 select-none"
          >
            Continue
          </button>
        </div>
      </footer>
    </div>
  );
}
