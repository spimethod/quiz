'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QuizLayout from '../../components/QuizLayout';

export default function WhyAvocadoPage() {
  const router = useRouter();
  const CURRENT_STEP = 15;
  const TOTAL_STEPS = 32;

  const handleContinue = () => {
    router.push('/quiz/medications');
  };

  const footerContent = (
    <div className="max-w-sm mx-auto w-full">
      <button
        onClick={handleContinue}
        onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
        className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap select-none"
      >
        Ready? Let's keep going!
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
        <div className="mb-3 sm:mb-4 mt-4 sm:mt-6 text-center">
          <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 leading-tight max-w-[540px] mx-auto [zoom:110%]:text-[min(4vw,2.5rem)] [zoom:125%]:text-[min(3.5vw,2rem)] [zoom:150%]:text-[min(3vw,1.75rem)]">
            Why Avo can become your AI mental-health companion?
          </h1>
        </div>

        {/* Description */}
        <div className="mb-6 sm:mb-8 text-center">
          <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed [zoom:110%]:text-[min(3vw,1.25rem)] [zoom:125%]:text-[min(2.5vw,1.1rem)] [zoom:150%]:text-[min(2vw,1rem)]">
            Created by psychologists and clinical specialists, Avocado operates on the most recent scientific discoveries in psychology, knowledge from more than a thousand books and thousands of real therapeutic cases.
          </p>
        </div>

        {/* Avocado Image */}
        <div className="flex justify-center mb-8">
          <Image
            src="/why-avocado.png"
            alt="Avocado Companion"
            width={600}
            height={600}
            className="w-80 h-80 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px] max-w-[55vh] max-h-[55vh] object-contain"
          />
        </div>
      </div>
    </QuizLayout>
  );
}

