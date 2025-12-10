'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import QuizLayout from '../../components/QuizLayout';

export default function CommunityPage() {
  const router = useRouter();
  const CURRENT_STEP = 24;
  const TOTAL_STEPS = 32;

  const handleContinue = () => {
    router.push('/quiz/customization');
  };

  const footerContent = (
    <div className="max-w-sm mx-auto w-full">
      <button
        onClick={handleContinue}
        onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
        className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 rounded-xl bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 select-none"
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
      className="px-4 sm:px-6 md:px-8 lg:px-10"
    >
      <div className="max-w-[600px] w-full mx-auto pt-16 sm:pt-24">
        <div className="flex justify-center w-full">
          <Image
            src="/community-reviews.png"
            alt="Community Reviews"
            width={600}
            height={600}
            className="w-full max-w-[400px] h-auto object-contain"
            priority
          />
        </div>
      </div>
    </QuizLayout>
  );
}

