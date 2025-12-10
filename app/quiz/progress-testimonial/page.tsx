'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QuizLayout from '../../components/QuizLayout';

// Total steps before email capture
const TOTAL_STEPS = 12;
const CURRENT_STEP = 8;

export default function ProgressTestimonialPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/quiz/main-goal');
  };

  const footerContent = (
    <div className="max-w-sm mx-auto w-full">
      <button
        onClick={handleContinue}
        onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
        className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 rounded-xl transition-all duration-300 bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer select-none"
      >
        Continue
      </button>
    </div>
  );

  return (
    <QuizLayout
      currentStep={CURRENT_STEP}
      totalSteps={TOTAL_STEPS}
      footer={footerContent}
      className="flex flex-col items-center"
    >
      <div className="max-w-md w-full mx-auto flex flex-col items-center pt-2 sm:pt-4">
        
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#1a1a1a] leading-tight mb-3 sm:mb-4 px-2">
          Feel real mental health progress in 2 weeks
        </h1>

        {/* Subtitle */}
        <p className="text-center text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 px-4 leading-relaxed">
          Avocado companion helps reduce stress and<br />build daily balance
        </p>

        {/* Testimonial Card Image */}
        <div className="relative w-full aspect-[3/4] max-w-sm mb-6">
          <Image
            src="/progress-testimonial.png"
            alt="User Progress Testimonial"
            fill
            className="object-contain"
            priority
          />
        </div>

      </div>
    </QuizLayout>
  );
}
