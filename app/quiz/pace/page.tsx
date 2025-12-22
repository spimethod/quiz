'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QuizLayout from '../../components/QuizLayout';

// Total steps before email capture
const TOTAL_STEPS = 12;
const CURRENT_STEP = 7;

const options = [
  { id: 'intense', label: '1 week (Intense)', icon: 'pace-horse.png' },
  { id: 'fast', label: '1 month (Fast)', icon: 'pace-rabbit.png' },
  { id: 'balanced', label: '2-3 months (Balanced)', icon: 'pace-elephant.png' },
  { id: 'gentle', label: '1 year (Gentle)', icon: 'pace-turtle.png' },
];

export default function PacePage() {
  const router = useRouter();
  const [selectedPace, setSelectedPace] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Очистка таймера при размонтировании компонента
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Scroll to bottom on initial load (when no option selected)
  useEffect(() => {
    if (!selectedPace) {
      const scrollToBottom = () => {
        // Wait for next frame to ensure DOM is fully rendered
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const optionsContainer = optionsRef.current;
            if (optionsContainer) {
              // Scroll to show the options container at the bottom
              const rect = optionsContainer.getBoundingClientRect();
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              const targetScroll = scrollTop + rect.bottom - window.innerHeight;
              
              window.scrollTo({
                top: Math.max(0, targetScroll),
                behavior: 'auto'
              });
            } else {
              // Fallback: scroll to absolute bottom
              window.scrollTo({
                top: document.documentElement.scrollHeight - window.innerHeight,
                behavior: 'auto'
              });
            }
          });
        });
      };
      
      // Try after various delays to catch different load states
      scrollToBottom();
      setTimeout(scrollToBottom, 100);
      setTimeout(scrollToBottom, 300);
      setTimeout(scrollToBottom, 600);
      
      // Also try after window load event
      const handleLoad = () => {
        setTimeout(scrollToBottom, 100);
      };
      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    }
  }, []); // Only on mount

  const handleSelect = (id: string) => {
    setSelectedPace(id);
    
    // Сбрасываем предыдущий таймер
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Запускаем новый таймер на 0.1 секунды
    timerRef.current = setTimeout(() => {
      handleContinue(id);
    }, 100);
  };

  const handleContinue = (paceId?: string) => {
    const paceToSave = paceId || selectedPace;
    if (paceToSave) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPace', paceToSave);
      }
      router.push('/quiz/progress-testimonial');
    }
  };

  return (
    <QuizLayout
      currentStep={CURRENT_STEP}
      totalSteps={TOTAL_STEPS}
      className="px-4 sm:px-6 md:px-8 lg:px-10"
    >
      <div className="max-w-md w-full mx-auto pt-2 sm:pt-4">
        
        {/* Title */}
        <div className="text-center mb-2 sm:mb-3">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] leading-tight">
            How fast do you want to progress?
          </h1>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed px-4">
            We'll adjust the pace with your 3D Avocado companion
          </p>
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {options.map((option) => {
            const isSelected = selectedPace === option.id;
            return (
              <div
                key={option.id}
                onClick={() => handleSelect(option.id)}
                onTouchEnd={(e) => { e.preventDefault(); handleSelect(option.id); }}
                className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none ${
                  isSelected
                    ? 'bg-[#f0fdf4] border-[#6B9D47] shadow-md scale-[1.02]'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {/* Icon */}
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 mr-4 flex-shrink-0">
                  {/* Используем заглушку если иконки еще не загружены, но код готов для реальных файлов */}
                  <Image
                    src={`/${option.icon}`}
                    alt={option.label}
                    fill
                    className="object-contain"
                    // Fallback to emoji if needed during dev, but relying on file names provided
                  />
                </div>

                {/* Label */}
                <span className={`flex-1 text-base sm:text-lg font-medium ${isSelected ? 'text-[#1a1a1a]' : 'text-gray-700'}`}>
                  {option.label}
                </span>

                {/* Radio Circle */}
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'border-[#6B9D47] bg-[#6B9D47]' : 'border-gray-300 bg-white'
                }`}>
                  {isSelected && (
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </QuizLayout>
  );
}

