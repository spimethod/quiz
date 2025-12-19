'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function RatingPage() {
  const router = useRouter();

  const handleRate = () => {
    // In future: redirect to app store rating
    router.push('/quiz/subscription');
  };

  const handleMaybeLater = () => {
    router.push('/quiz/subscription');
  };

  return (
    <div className="bg-[#f5f5f0] flex flex-col overflow-hidden sm:min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 flex-shrink-0 pt-2 sm:pt-4 pb-0 px-8 sm:px-10 md:px-12 lg:px-6 bg-[#f5f5f0]">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 pt-8 sm:pt-12 sm:flex-1">
        <div className="max-w-md mx-auto text-center">
          {/* Title */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              One rating can bring peace to someone's day
            </h1>
          </div>

          {/* Description */}
          <div className="mb-6 sm:mb-8">
            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
              Your rating helps Avocado grow—so more people can get the support they need
            </p>
          </div>

          {/* Avocado Character with Rating */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <Image
              src="/avocado-rating-prompt.png"
              alt="Avocado asking for rating"
              width={300}
              height={300}
              priority
              className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 max-w-[60vw] max-h-[60vw] object-contain"
            />
          </div>
        </div>
      </main>

      {/* Footer with Action Buttons */}
      <footer className="pb-6 px-4 sm:px-6 sm:fixed sm:bottom-0 sm:left-0 sm:right-0 sm:bg-[#f5f5f0] sm:pt-4 sm:pb-6">
        <div className="max-w-sm mx-auto space-y-4">
          {/* Maybe Later */}
          <div className="text-center">
            <button
              onClick={handleMaybeLater}
              onTouchEnd={(e) => { e.preventDefault(); handleMaybeLater(); }}
              className="text-gray-500 hover:text-gray-700 text-sm sm:text-base transition-colors duration-200 select-none"
            >
              Maybe later
            </button>
          </div>

          {/* Rate Button */}
          <button
            onClick={handleRate}
            onTouchEnd={(e) => { e.preventDefault(); handleRate(); }}
            className="w-full bg-[#6B9D47] hover:bg-[#5d8a3d] text-white font-semibold text-base sm:text-lg md:text-xl py-3 sm:py-4 px-8 sm:px-12 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer select-none"
          >
            Yes, I'll rate
          </button>
        </div>
      </footer>
    </div>
  );
}
