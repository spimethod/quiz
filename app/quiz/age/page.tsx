'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BackButton from '../../components/BackButton';
import { getProgressPercentage } from '../../utils/progress';

const TOTAL_STEPS = 12;
const CURRENT_STEP = 2;

export default function AgePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const [age, setAge] = useState(25);
  const [preferNotToSay, setPreferNotToSay] = useState(false);

  // OLD FUNCTION - COMMENTED OUT
  // Function to update line position - simple approach with separate element
  // const updateLinePosition = useCallback((currentAge?: number) => {
  //   if (sliderRef.current && lineRef.current) {
  //     if (preferNotToSay) {
  //       lineRef.current.style.display = 'none';
  //       return;
  //     }
  //     
  //     const ageValue = currentAge !== undefined ? currentAge : age;
  //     const min = 16;
  //     const max = 75;
  //     const percentage = ((ageValue - min) / (max - min)) * 100;
  //     
  //     const sliderRect = sliderRef.current.getBoundingClientRect();
  //     const container = sliderRef.current.parentElement;
  //     
  //     if (container) {
  //       const containerRect = container.getBoundingClientRect();
  //       const trackTop = sliderRect.top - containerRect.top + (sliderRect.height / 2) - 4;
  //       
  //       const sliderWidth = sliderRect.width;
  //       const thumbTouchArea = 44;
  //       const thumbPadding = thumbTouchArea / 2; // 22px
  //       const thumbVisibleRadius = 12;
  //       
  //       // Calculate thumb center position
  //       const trackWidth = sliderWidth - (thumbPadding * 2);
  //       const thumbCenterPos = thumbPadding + (percentage / 100) * trackWidth;
  //       
  //       // Line should reach right edge of visible thumb
  //       const lineWidth = thumbCenterPos + thumbVisibleRadius;
  //       
  //       lineRef.current.style.display = 'block';
  //       lineRef.current.style.top = `${trackTop}px`;
  //       lineRef.current.style.left = '0px';
  //       lineRef.current.style.width = `${lineWidth}px`;
  //     }
  //   }
  // }, [age, preferNotToSay]);

  // NEW APPROACH: Use CSS gradient on slider background itself, calculated to reach thumb center
  const updateSliderProgress = useCallback((currentAge?: number) => {
    if (!sliderRef.current) return;
    
    if (preferNotToSay) {
      sliderRef.current.style.setProperty('--slider-progress', '0%');
      return;
    }
    
    const ageValue = currentAge !== undefined ? currentAge : age;
    const min = 16;
    const max = 75;
    const rawPercentage = ((ageValue - min) / (max - min)) * 100;
    
    // Calculate thumb center position
    // Browser adds padding (22px on each side for 44px thumb) to keep thumb within bounds
    const sliderWidth = sliderRef.current.offsetWidth;
    const thumbPadding = 22; // Browser padding to keep thumb within bounds (half of 44px thumb)
    
    // Thumb center moves from thumbPadding to (sliderWidth - thumbPadding)
    const thumbCenterMin = thumbPadding;
    const thumbCenterMax = sliderWidth - thumbPadding;
    const thumbCenterRange = thumbCenterMax - thumbCenterMin;
    
    // Calculate thumb center position for current percentage
    const thumbCenterPos = thumbCenterMin + (rawPercentage / 100) * thumbCenterRange;
    
    // Line should reach the center of the thumb
    // Convert to percentage of slider width
    const progressPercentage = (thumbCenterPos / sliderWidth) * 100;
    
    sliderRef.current.style.setProperty('--slider-progress', `${progressPercentage}%`);
  }, [age, preferNotToSay]);

  // Update slider progress CSS variable
  useEffect(() => {
    updateSliderProgress();
  }, [age, preferNotToSay, updateSliderProgress]);

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
    router.push('/quiz/before-start');
  };

  return (
    <div
      ref={containerRef}
      data-age="true"
      className="flex flex-col bg-[#f5f5f0] portrait:fixed portrait:inset-0 portrait:overflow-hidden landscape:min-h-screen landscape:overflow-y-auto landscape:overflow-x-hidden"
      style={{
        overscrollBehavior: 'none'
      }}
    >
      {/* Portrait mode: disable touch scroll */}
      <style jsx>{`
        @media (orientation: portrait) {
          div[data-age="true"] {
            touch-action: none;
          }
        }
        
        .slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          outline: none;
          touch-action: pan-x !important;
          cursor: pointer;
          pointer-events: auto;
          background: linear-gradient(to right, #6B9D47 0%, #6B9D47 var(--slider-progress, 0%), #d1d5db var(--slider-progress, 0%), #d1d5db 100%);
        }
        
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: radial-gradient(circle at center, #6B9D47 10px, white 10px, white 12px, transparent 12px);
          cursor: pointer;
          border: none;
          margin-top: -4px;
          touch-action: pan-x !important;
          pointer-events: auto;
        }

        .slider::-moz-range-thumb {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: radial-gradient(circle at center, #6B9D47 10px, white 10px, white 12px, transparent 12px);
          cursor: pointer;
          border: none;
        }

        .slider:disabled::-webkit-slider-thumb {
          background: radial-gradient(circle at center, #9ca3af 10px, white 10px, white 12px, transparent 12px);
        }

        .slider:disabled::-moz-range-thumb {
          background: radial-gradient(circle at center, #9ca3af 10px, white 10px, white 12px, transparent 12px);
        }

        .slider:disabled {
          cursor: not-allowed;
          background: #d1d5db !important;
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
      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-2">
        <div className="max-w-md w-full mx-auto flex flex-col items-center">
          
          {/* Avocado Characters Image */}
          <div className="flex justify-center mb-1">
            <Image
              src="/age-avocados.png"
              alt="Avocado Characters"
              width={400}
              height={400}
              className="portrait:h-[28vh] landscape:h-[25vh] w-auto object-contain"
              priority
            />
          </div>

          {/* Title and Subtitle */}
          <div className="text-center mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              What's your age?
            </h1>
            <p className="text-sm text-gray-700 px-2">
              Used only to tailor your AI report and step-by-step plan
            </p>
          </div>

          {/* Age Slider */}
          <div className="w-full max-w-sm mb-2">
            <div className="text-center mb-2">
              <p className="text-xs text-gray-600 mb-1">Slide to select your age</p>
              <p className="text-3xl font-bold text-gray-900">{age}</p>
            </div>

            {/* Slider - 44px touch area, 20px visual thumb */}
            <div 
              className="py-5 relative" 
              style={{ touchAction: 'pan-x' }}
            >
              <div className="px-2 relative">
                <input
                  type="range"
                  min="16"
                  max="75"
                  value={age}
                  onChange={(e) => {
                    const newAge = Number(e.target.value);
                    setAge(newAge);
                    updateSliderProgress(newAge);
                  }}
                  onInput={(e) => {
                    const newAge = Number((e.target as HTMLInputElement).value);
                    setAge(newAge);
                    updateSliderProgress(newAge);
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                  }}
                  onTouchMove={(e) => {
                    e.stopPropagation();
                    if (sliderRef.current) {
                      const currentValue = Number(sliderRef.current.value);
                      updateSliderProgress(currentValue);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  onMouseMove={(e) => {
                    if (e.buttons === 1) {
                      e.stopPropagation();
                      if (sliderRef.current) {
                        const currentValue = Number(sliderRef.current.value);
                        updateSliderProgress(currentValue);
                      }
                    }
                  }}
                  disabled={preferNotToSay}
                  className="slider relative z-10"
                  ref={sliderRef}
                  style={{
                    touchAction: 'pan-x',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>16</span>
                <span>75+</span>
              </div>
            </div>

            {/* Age Comment */}
            <div className="text-center mt-1 min-h-[30px]">
              {!preferNotToSay && (
                <p className="text-xs text-gray-600 italic px-2">
                  {getAgeComment(age)}
                </p>
              )}
            </div>
          </div>

          {/* Prefer not to say checkbox */}
          <div className="mb-2">
            <label className="flex items-center justify-center cursor-pointer group">
              <input
                type="checkbox"
                checked={preferNotToSay}
                onChange={(e) => setPreferNotToSay(e.target.checked)}
                className="w-4 h-4 text-[#6B9D47] bg-gray-100 border-gray-300 rounded focus:ring-[#6B9D47] focus:ring-2 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                Prefer not to say <span className="text-gray-500 text-xs">(less accurate results)</span>
              </span>
            </label>
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
