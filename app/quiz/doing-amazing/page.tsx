'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BackButton from '@/app/components/BackButton';

export default function DoingAmazingPage() {
  const router = useRouter();
  const CURRENT_STEP = 6;
  const TOTAL_STEPS = 12;

  const handleContinue = () => {
    router.push('/quiz/sleep-trouble');
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
      <main className="flex-grow-0 px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="max-w-[660px] w-full mx-auto">
          {/* Title */}
          <div className="mb-3 sm:mb-4 mt-4 sm:mt-6 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight [zoom:110%]:text-[min(4vw,2.5rem)] [zoom:125%]:text-[min(3.5vw,2rem)] [zoom:150%]:text-[min(3vw,1.75rem)]">
              You're doing amazing!
            </h1>
          </div>

          {/* Description */}
          <div className="mb-8 sm:mb-10 text-center">
            <p className="text-gray-600 text-base sm:text-lg md:text-xl [zoom:110%]:text-[min(3vw,1.25rem)] [zoom:125%]:text-[min(2.5vw,1.1rem)] [zoom:150%]:text-[min(2vw,1rem)]">
              Every step you take is helping you understand yourself better. Be proud of your progress — you've got this!
            </p>
          </div>

          {/* Avocado Image */}
          <div className="flex justify-center mb-8">
            <Image
              src="/doing-amazing.png"
              alt="Happy Avocado"
              width={400}
              height={400}
              className="w-48 h-48 sm:w-52 sm:h-52 md:w-60 md:h-60 max-w-[34vh] max-h-[34vh] [zoom:110%]:w-[min(24vh,220px)] [zoom:110%]:h-[min(24vh,220px)] [zoom:125%]:w-[min(22vh,200px)] [zoom:125%]:h-[min(22vh,200px)] [zoom:150%]:w-[min(20vh,180px)] [zoom:150%]:h-[min(20vh,180px)]"
            />
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
            Keep going
          </button>
        </div>
      </footer>
    </div>
  );
}
