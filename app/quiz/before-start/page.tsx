'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QuizLayout from '../../components/QuizLayout';

// Total steps before email capture
const TOTAL_STEPS = 12;
const CURRENT_STEP = 3;

export default function BeforeStartPage() {
  const router = useRouter();

  const handleContinue = () => {
    // Navigate to name page
    router.push('/quiz/name');
  };

  const footerContent = (
    <button
      onClick={handleContinue}
      className="bg-[#6B9D47] hover:bg-[#5d8a3d] text-white font-semibold text-base sm:text-lg md:text-xl py-2.5 sm:py-3 md:py-3.5 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer w-full max-w-md"
    >
      Continue
    </button>
  );

  return (
    <QuizLayout
      currentStep={CURRENT_STEP}
      totalSteps={TOTAL_STEPS}
      footer={footerContent}
      className="px-8 sm:px-10 md:px-12 lg:px-6 pb-6"
    >
      <div className="max-w-2xl w-full mx-auto">
        {/* Hero Image - Avocado */}
        <div className="flex justify-center mb-2 sm:mb-3 mt-4 sm:mt-6">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
            <Image
              src="/before-start-hand.png"
              alt="Avocado Character"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Meet Avocado Section - ПЕРВЫЙ БЛОК */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-white/60 rounded-xl p-4 sm:p-5 shadow-sm max-w-lg w-full">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-center">
              Meet Avocado!
            </h2>
            <p className="text-sm sm:text-base text-gray-700 text-center">
              Hi there, I'm Avo! Let's take care of your mind<br />and heart together!
            </p>
          </div>
        </div>

        {/* Title - ПОСЛЕ Meet Avocado */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Before we start
          </h1>
        </div>

        {/* Main Description - ВТОРОЙ БЛОК */}
        <div className="flex justify-center mb-6">
          <div className="max-w-lg w-full px-4 sm:px-5">
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-justify">
              This 3-minute checkup is a brief, honest reflection. Your answers help <strong className="font-semibold">Avocado</strong>, your <strong className="font-semibold">AI companion</strong>, create a personal mental health report with tailored recommendations and a step-by-step improvement plan.
            </p>
          </div>
        </div>

        {/* Disclaimer - без заголовка, узкий, мелкий шрифт */}
        <div className="flex justify-center pb-4">
          <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed text-justify w-full max-w-md">
            Avocado provides helpful tools for managing stress and supporting your mental health. However, it's not a substitute for professional therapy. If you ever feel overwhelmed, please reach out to a licensed professional.
          </p>
        </div>
      </div>
    </QuizLayout>
  );
}
