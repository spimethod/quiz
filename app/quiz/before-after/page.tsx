'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import QuizLayout from '../../components/QuizLayout';

export default function BeforeAfterPage() {
  const router = useRouter();
  const CURRENT_STEP = 26;
  const TOTAL_STEPS = 32;
  const [avatar, setAvatar] = useState('girl'); // Default to girl

  useEffect(() => {
    // Проверяем выбор пользователя (boy/girl)
    const savedAvatar = localStorage.getItem('avatarPreference');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  const handleContinue = () => {
    router.push('/quiz/time');
  };

  // Выбор картинки в зависимости от пола
  // Для 'boy' используем текущую картинку (before-after-avocado.png)
  // Для 'girl' нужно добавить файл before-after-avocado-girl.png в папку public
  const imageSrc = avatar === 'girl' ? '/before-after-avocado-girl.png' : '/before-after-avocado.png';

  const footerContent = (
    <div className="max-w-sm mx-auto w-full">
      <button
        onClick={handleContinue}
        className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 sm:py-4 px-12 sm:px-16 md:px-20 rounded-xl bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300"
      >
        Continue my journey
      </button>
    </div>
  );

  return (
    <QuizLayout
      currentStep={CURRENT_STEP}
      totalSteps={TOTAL_STEPS}
      footer={footerContent}
      className="px-4 sm:px-6 md:px-8 lg:px-10"
    >
      <div className="max-w-[660px] w-full mx-auto">
        {/* Title */}
        <div className="mb-8 sm:mb-10 text-center pt-4">
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
            src={imageSrc}
            alt="Happy Avocado"
            width={400}
            height={400}
            className="w-80 h-80 sm:w-88 sm:h-88 md:w-96 md:h-96 max-w-[52vh] max-h-[52vh] object-contain"
            priority // Важно для LCP и быстрой смены
          />
        </div>
      </div>
    </QuizLayout>
  );
}
