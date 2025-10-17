'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Total steps before email capture
const TOTAL_STEPS = 12;
const CURRENT_STEP = 3;

export default function BeforeStartPage() {
  const router = useRouter();

  const handleContinue = () => {
    // Navigate to feelings page
    router.push('/quiz/feelings');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f0] animate-fadeIn">
      {/* Header with Logo and Progress */}
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
      <main className="flex-1 overflow-y-auto overflow-x-hidden px-8 sm:px-10 md:px-12 lg:px-6 pb-6">
        <div className="max-w-2xl w-full mx-auto">
          {/* Hero Image - Avocado */}
          <div className="flex justify-center mb-2 sm:mb-3 mt-4 sm:mt-6">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
              <Image
                src="/before-start-hand.png"
                alt="Avocado Character"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Meet Avocado Section - ПЕРВЫЙ БЛОК */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-white/60 rounded-xl p-4 sm:p-5 shadow-sm max-w-lg w-full">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-center">
                Meet Avocado!
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                Hi there, I'm Avocado! Let's take care of your mind and heart together!
              </p>
            </div>
          </div>

          {/* Title - ПОСЛЕ Meet Avocado */}
          <div className="text-center mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Before we start
            </h1>
          </div>

          {/* Main Description - ВТОРОЙ БЛОК */}
          <div className="flex justify-center mb-6">
            <div className="max-w-lg w-full px-4 sm:px-5">
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-justify">
                This 3-minute checkup is a brief, honest reflection. Your answers help <strong className="font-semibold">Avocado</strong>—your <strong className="font-semibold">AI companion</strong>—create a personal mental health report with tailored recommendations and a step-by-step improvement plan
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center mb-3">
            <button
              onClick={handleContinue}
              className="bg-[#6B9D47] hover:bg-[#5d8a3d] text-white font-semibold text-base sm:text-lg md:text-xl py-2.5 sm:py-3 md:py-3.5 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer w-full max-w-md"
            >
              Continue
            </button>
          </div>

          {/* Disclaimer - без заголовка, узкий, мелкий шрифт */}
          <div className="flex justify-center pb-4">
            <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed text-justify w-full max-w-md">
              Avocado provides helpful tools for managing stress and supporting your mental health. However, it's not a substitute for professional therapy. If you ever feel overwhelmed, please reach out to a licensed professional.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

