'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BackButton from '../../components/BackButton';
import { getProgressPercentage } from '../../utils/progress';

const TOTAL_STEPS = 12;
const CURRENT_STEP = 3;

export default function BeforeStartPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContinue = () => {
    router.push('/quiz/personal-plan');
  };

  return (
    <div
      ref={containerRef}
      data-before-start="true"
      className="flex flex-col bg-[#f5f5f0] portrait:fixed portrait:inset-0 portrait:overflow-hidden landscape:min-h-screen landscape:overflow-y-auto landscape:overflow-x-hidden"
      style={{
        overscrollBehavior: 'none'
      }}
    >
      {/* Portrait mode: disable touch scroll */}
      <style jsx>{`
        @media (orientation: portrait) {
          div[data-before-start="true"] {
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
          
          {/* Hero Image - Avocado */}
          <div className="flex justify-center mb-1">
            <div className="relative portrait:h-[22vh] landscape:h-[20vh] w-[200px]">
              <Image
                src="/before-start-hand.png"
                alt="Avocado Character"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Meet Avocado Section */}
          <div className="flex justify-center mb-3 w-full">
            <div className="bg-white/60 rounded-xl p-3 shadow-sm w-full">
              <h2 className="text-base font-bold text-gray-900 mb-1 text-center">
                Meet Avocado!
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 text-center">
                Hi there, I'm Avo! Let's take care of your mind<br />and heart together!
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Before we start
            </h1>
          </div>

          {/* Main Description */}
          <div className="flex justify-center mb-8">
            <div className="w-full px-2">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-justify">
                This 3-minute checkup is a brief, honest reflection. Your answers help <strong className="font-semibold">Avocado</strong>, your <strong className="font-semibold">AI companion</strong>, create a personal mental health report with tailored recommendations and a step-by-step improvement plan.
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex justify-center">
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed text-justify w-full px-2">
              Avocado provides helpful tools for managing stress and supporting your mental health. However, it's not a substitute for professional therapy. If you ever feel overwhelmed, please reach out to a licensed professional.
            </p>
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
