'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Total steps before email capture (update this as you add more pages)
const TOTAL_STEPS = 12; // This will be the step number of the email capture page
const CURRENT_STEP = 2;

export default function AgePage() {
  const router = useRouter();
  const [age, setAge] = useState(40);
  const [preferNotToSay, setPreferNotToSay] = useState(false);

  const getAgeComment = (age: number) => {
    if (age >= 16 && age <= 29) {
      return "🌿 A beautiful time to grow, explore, and take care of yourself!";
    } else if (age >= 30 && age <= 39) {
      return "🌿 A powerful time to find balance and embrace who you are!";
    } else if (age >= 40 && age <= 49) {
      return "🌿 A wonderful time to invest in your well-being and joy!";
    } else if (age >= 50 && age <= 59) {
      return "🌿 A golden time for reflection, self-care, and new beginnings!";
    } else {
      return "🌿 A graceful time to celebrate life and take gentle care of yourself!";
    }
  };

  const handleContinue = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userAge', preferNotToSay ? 'prefer-not-to-say' : age.toString());
    }
    // Navigate to before-start page
    router.push('/quiz/before-start');
  };

  return (
    <div className="h-screen flex flex-col bg-[#f5f5f0] animate-fadeIn overflow-hidden">
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
      <main className="flex-1 overflow-y-auto overflow-x-hidden px-8 sm:px-10 md:px-12 lg:px-6 pb-2 sm:pb-4">
        <div className="max-w-2xl w-full mx-auto">
          {/* Avocado Characters Image */}
          <div className="flex justify-center mb-1 sm:mb-2 mt-2 sm:mt-0">
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 max-w-[35vh] max-h-[35vh] avocado-zoom-fix">
              <Image
                src="/age-avocados.png"
                alt="Avocado Characters"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center mb-2 sm:mb-3">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-1.5">
              What's your age?
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-1 sm:mb-2 px-2">
              Used only to tailor your AI report and step-by-step plan
            </p>
          </div>

          {/* Age Slider */}
          <div className="mb-1 sm:mb-2">
            <div className="text-center mb-1 sm:mb-2">
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-0.5 sm:mb-1">Slide to select your age</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{age}</p>
            </div>

            {/* Slider */}
            <div className="relative px-2 sm:px-4">
              <input
                type="range"
                min="16"
                max="75"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                disabled={preferNotToSay}
                className="w-full h-1.5 sm:h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: preferNotToSay 
                    ? '#d1d5db' 
                    : `linear-gradient(to right, #6B9D47 0%, #6B9D47 ${((age - 16) / (75 - 16)) * 100}%, #d1d5db ${((age - 16) / (75 - 16)) * 100}%, #d1d5db 100%)`
                }}
              />
              <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">
                <span>16</span>
                <span>75+</span>
              </div>
            </div>

            {/* Age Comment */}
            <div className="text-center mt-0.5 sm:mt-1 min-h-[35px] sm:min-h-[45px]">
              {!preferNotToSay && (
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 italic px-2 sm:px-4">
                  {getAgeComment(age)}
                </p>
              )}
            </div>
          </div>

          {/* Prefer not to say checkbox */}
          <div className="mb-2 sm:mb-3">
            <label className="flex items-center justify-center cursor-pointer group">
              <input
                type="checkbox"
                checked={preferNotToSay}
                onChange={(e) => setPreferNotToSay(e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B9D47] bg-gray-100 border-gray-300 rounded focus:ring-[#6B9D47] focus:ring-2 cursor-pointer"
              />
              <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-700 group-hover:text-gray-900">
                Prefer not to say <span className="text-gray-500 text-xs sm:text-sm">(less accurate results)</span>
              </span>
            </label>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center px-4 mt-1 sm:mt-2">
            <button
              onClick={handleContinue}
              className="bg-[#6B9D47] hover:bg-[#5d8a3d] text-white font-semibold text-base sm:text-lg md:text-xl py-2 sm:py-2.5 md:py-3 px-8 sm:px-10 md:px-12 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer w-full max-w-md"
            >
              Continue
            </button>
          </div>
        </div>
      </main>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #6B9D47;
          cursor: pointer;
          border: 2.5px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #6B9D47;
          cursor: pointer;
          border: 2.5px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider:disabled::-webkit-slider-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .slider:disabled::-moz-range-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .slider:disabled {
          cursor: not-allowed;
        }

        @media (min-width: 640px) {
          .slider::-webkit-slider-thumb {
            width: 24px;
            height: 24px;
            border: 3px solid white;
          }

          .slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border: 3px solid white;
          }
        }

        /* Уменьшение картинки только при zoom 150%+ (узкий viewport на десктопе) */
        @media (max-width: 950px) and (min-width: 641px) {
          .avocado-zoom-fix {
            max-width: 25vh !important;
            max-height: 25vh !important;
          }
        }
      `}</style>
    </div>
  );
}

