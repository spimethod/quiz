'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ResultsPage() {
  const router = useRouter();
  const CURRENT_STEP = 10;
  const TOTAL_STEPS = 12;

  const handleContinue = () => {
      router.push('/quiz/social-groups');
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
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight max-w-[540px] mx-auto [zoom:110%]:text-[min(4vw,2.5rem)] [zoom:125%]:text-[min(3.5vw,2rem)] [zoom:150%]:text-[min(3vw,1.75rem)]">
              82% of users feel relief within 4 weeks
            </h1>
          </div>

          {/* Description */}
          <div className="mb-8 sm:mb-10 text-center">
            <p className="text-gray-600 text-base sm:text-lg md:text-xl [zoom:110%]:text-[min(3vw,1.25rem)] [zoom:125%]:text-[min(2.5vw,1.1rem)] [zoom:150%]:text-[min(2vw,1rem)]">
              You're doing great! Most people who use Avocado start feeling better in just a few weeks. Let's keep going — a few more quick questions and we'll personalize your journey!
            </p>
          </div>

          {/* Avocado Image */}
          <div className="flex justify-center mb-8">
            <Image
              src="/results-avocado.png"
              alt="Avocado with Results Chart"
              width={400}
              height={400}
              className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 max-w-[42vh] max-h-[42vh] object-contain [zoom:110%]:w-[min(28vh,260px)] [zoom:110%]:h-[min(28vh,260px)] [zoom:125%]:w-[min(25vh,240px)] [zoom:125%]:h-[min(25vh,240px)] [zoom:150%]:w-[min(22vh,220px)] [zoom:150%]:h-[min(22vh,220px)]"
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
            A few more questions!
          </button>
        </div>
      </footer>
    </div>
  );
}
