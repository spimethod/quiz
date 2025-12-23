'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BackButton from '../../components/BackButton';
import { getProgressPercentage } from '../../utils/progress';

const TOTAL_STEPS = 12;
const CURRENT_STEP = 5;

export default function PersonalPlanPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContinue = () => {
    router.push('/quiz/feelings');
  };

  return (
    <div
      ref={containerRef}
      data-personal-plan="true"
      className="flex flex-col bg-[#f5f5f0] portrait:fixed portrait:inset-0 portrait:overflow-hidden landscape:min-h-screen landscape:overflow-y-auto landscape:overflow-x-hidden"
      style={{
        overscrollBehavior: 'none'
      }}
    >
      {/* Portrait mode: disable touch scroll */}
      <style jsx>{`
        @media (orientation: portrait) {
          div[data-personal-plan="true"] {
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

      {/* Main Content - Image Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Centered Image */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="relative w-full h-full max-w-lg">
            <Image
              src="/personal-plan-avocado.png"
              alt="Avocado Plan"
              fill
              className="object-contain object-center scale-[1.8] portrait:translate-y-32 landscape:translate-y-20"
              priority
            />
          </div>
        </div>
      </main>

      {/* Bottom Card + Footer - unified white container */}
      <footer className="bg-white relative z-20">
        <div className="w-full sm:max-w-[500px] mx-auto rounded-t-[40px] sm:rounded-[40px] px-6 pt-8 pb-4 shadow-[0_-10px_60px_rgba(0,0,0,0.08)]">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-3 leading-tight">
              Avocado builds a personal mental-health plan just for you
            </h1>
            
            <p className="text-gray-500 text-sm mb-6 leading-relaxed px-2 font-medium">
              Reach your goal faster with your 3D AI companion built on the latest <span className="font-bold text-gray-800">psychological science</span>
            </p>

            {/* Continue Button */}
            <div className="px-0 pb-2">
              <button
                onClick={handleContinue}
                onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
                className="w-full font-semibold text-lg py-3 px-8 rounded-xl transition-all duration-300 bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer select-none"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
