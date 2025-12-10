'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QuizLayout from '../../components/QuizLayout';

export default function DoingAmazingPage() {
  const router = useRouter();
  const CURRENT_STEP = 11;
  const TOTAL_STEPS = 12;

  const handleContinue = () => {
    router.push('/quiz/sleep-trouble');
  };

  const footerContent = (
    <div className="max-w-sm mx-auto w-full">
      <button
        onClick={handleContinue}
        onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
        className="w-full font-semibold text-base sm:text-lg md:text-xl py-2.5 sm:py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer select-none"
      >
        Keep going
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
      <div className="max-w-[660px] w-full mx-auto flex flex-col items-center">
        {/* Title */}
        <div className="mb-3 sm:mb-4 mt-4 sm:mt-6 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            You're doing amazing!
          </h1>
        </div>

        {/* Description */}
        <div className="mb-8 sm:mb-10 text-center">
          <p className="text-gray-600 text-base sm:text-lg md:text-xl">
            Every step you take is helping you understand yourself better. Be proud of your progress — you've got this!
          </p>
        </div>

        {/* Avocado Image */}
        <div className="flex justify-center mb-8">
          <Image
            src="/doing-amazing.png"
            alt="Happy Avocado"
            width={500}
            height={500}
            className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain"
            priority
          />
        </div>
      </div>
    </QuizLayout>
  );
}
