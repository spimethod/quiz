'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function BeforeAfterPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/quiz/email-capture');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="relative pt-4 sm:pt-6 pb-2">
        <div className="absolute left-8 sm:left-20 md:left-40 lg:left-52 top-3 sm:top-5">
          <button
            onClick={() => router.back()}
            className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-full transition-all duration-200 hover:scale-110 z-10"
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
        </div>
        <div className="flex justify-center items-center">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow-0 px-4 sm:px-6 md:px-8 lg:px-10 lg:pb-24">
        <div className="max-w-[660px] w-full mx-auto">
          {/* Title */}
          <div className="mb-8 sm:mb-10 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Before and After<br />using Avocado
            </h1>
          </div>

          {/* Before and After Comparison */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8 md:gap-12 mb-8 sm:mb-12 items-start">
            {/* Before Column */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                Before
              </h2>
              <div className="space-y-4 ml-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">×</span>
                  </div>
                  <span className="text-gray-700 text-sm sm:text-lg">
                    Feelings of anxiety and stress
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">×</span>
                  </div>
                  <span className="text-gray-700 text-sm sm:text-lg">
                    Mood swings
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">×</span>
                  </div>
                  <span className="text-gray-700 text-sm sm:text-lg">
                    Struggles with self-esteem
                  </span>
                </div>
              </div>
            </div>

            {/* After Column */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                After
              </h2>
              <div className="space-y-4 ml-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm sm:text-lg">
                    Inner peace and confidence
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm sm:text-lg">
                    Stable emotional state
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm sm:text-lg">
                    Self-care and self-love
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Avocado Character Image */}
          <div className="flex justify-center mb-8">
            <Image
              src="/before-after-avocado.png"
              alt="Happy Avocado"
              width={400}
              height={400}
              className="w-80 h-80 sm:w-88 sm:h-88 md:w-96 md:h-96 max-w-[52vh] max-h-[52vh] object-contain"
            />
          </div>
        </div>
      </main>

      {/* Footer with Continue Button */}
      <footer className="pb-6 lg:fixed lg:bottom-0 lg:left-0 lg:right-0 lg:bg-[#f5f5f0] lg:pt-4 lg:pb-6">
        <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4rem)] max-w-sm mx-auto">
          <button
            onClick={handleContinue}
            className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 sm:py-4 px-12 sm:px-16 md:px-20 rounded-xl bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300"
          >
            Continue my journey
          </button>
        </div>
      </footer>
    </div>
  );
}
