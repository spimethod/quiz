'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QuizLayout from '../../components/QuizLayout';

export default function ReviewsPage() {
  const router = useRouter();
  // Этот шаг считается частью квиза
  const CURRENT_STEP = 1; 
  const TOTAL_STEPS = 12;

  const handleContinue = () => {
    // Переход к следующему шагу (Age)
    router.push('/quiz/age');
  };

  const footerContent = (
    <button
      onClick={handleContinue}
      onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
      className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-8 rounded-xl transition-all duration-300 bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer max-w-md select-none"
    >
      Continue
    </button>
  );

  return (
    <QuizLayout
      currentStep={CURRENT_STEP}
      totalSteps={TOTAL_STEPS}
      footer={footerContent}
      className="flex flex-col items-center"
    >
      <div className="max-w-md w-full mx-auto flex flex-col items-center pt-[30px]">
        
        {/* Title */}
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-center text-[#1a1a1a] leading-tight mb-4 px-2">
          People worldwide use<br />Avocado to feel better<br />day after day
        </h1>

        {/* Subtitle */}
        <p className="text-center text-gray-600 text-sm sm:text-base mb-4 sm:mb-8 px-4 leading-relaxed">
          Over 100,000 users practice daily toward inner balance with an AI companion
        </p>

        {/* Review Card Image */}
        {/* Используем review-card.png как запрошено */}
        <div className="relative w-full aspect-[4/5] sm:aspect-square max-w-[85%] sm:max-w-md mb-4 sm:mb-6 px-2 sm:px-0">
          <Image
            src="/review-card.png"
            alt="User Review"
            fill
            className="object-contain"
            priority
          />
        </div>

      </div>
    </QuizLayout>
  );
}

