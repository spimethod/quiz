'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BackButton from '../../components/BackButton';
import { getProgressPercentage } from '../../utils/progress';

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

  const containerRef = useRef<HTMLDivElement>(null);

  // Очистка таймера при размонтировании компонента
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

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
    <div
      ref={containerRef}
      data-pace="true"
      className="flex flex-col bg-[#f5f5f0] portrait:fixed portrait:inset-0 portrait:overflow-hidden landscape:min-h-screen landscape:overflow-y-auto landscape:overflow-x-hidden"
      style={{
        overscrollBehavior: 'none'
      }}
    >
      {/* Portrait mode: disable touch scroll */}
      <style jsx>{`
        @media (orientation: portrait) {
          div[data-pace="true"] {
            touch-action: none;
          }
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
      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-4">
        <div className="max-w-md w-full mx-auto flex flex-col items-center">
          
          {/* Title */}
          <div className="text-center mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">
              How fast do you want to progress?
            </h1>
          </div>

          {/* Subtitle */}
          <div className="text-center mb-4">
            <p className="text-gray-600 text-sm leading-relaxed px-4">
              We'll adjust the pace with your 3D Avocado companion
            </p>
          </div>

          {/* Options List */}
          <div ref={optionsRef} className="flex flex-col gap-3 w-full">
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
      </main>
    </div>
  );
}

