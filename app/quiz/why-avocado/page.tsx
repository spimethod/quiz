'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BackButton from '../../components/BackButton';
import { getProgressPercentage } from '../../utils/progress';

export default function WhyAvocadoPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const CURRENT_STEP = 15;
  const TOTAL_STEPS = 32;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleContinue = () => {
    router.push('/quiz/medications');
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col bg-[#f5f5f0] min-h-screen overflow-y-auto overflow-x-hidden"
      style={{
        overscrollBehavior: 'none'
      }}
    >

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
      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-4 pb-24">
        <div className="max-w-md w-full mx-auto flex flex-col items-center">
          
          {/* Title */}
          <div className="mb-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight px-2">
              Why Avo can become your AI mental-health companion?
            </h1>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="text-gray-600 text-sm leading-relaxed text-left px-2">
              Created by psychologists and clinical specialists, Avocado operates on the most recent scientific discoveries in psychology, knowledge from more than a thousand books and thousands of real therapeutic cases.
            </p>
          </div>

          {/* Avocado Image */}
          <div className="flex justify-center mb-2">
            <Image
              src="/why-avocado.png"
              alt="Avocado Companion"
              width={600}
              height={600}
              className="portrait:h-[40vh] landscape:h-[35vh] w-auto object-contain"
              priority
            />
          </div>

        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-[#f5f5f0] z-20">
        <div className="max-w-md mx-auto w-full flex justify-center">
          <button
            onClick={handleContinue}
            onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
            className="w-full font-semibold text-lg py-3 px-8 rounded-xl transition-all duration-300 bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer select-none"
          >
            Ready? Let's keep going!
          </button>
        </div>
      </footer>
    </div>
  );
}
