'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QuizLayout from '../../components/QuizLayout';

export default function SocialGroupsPage() {
  const router = useRouter();
  const CURRENT_STEP = 22;
  const TOTAL_STEPS = 32;

  const handleSelect = (option: 'yes' | 'no') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('socialGroups', option);
    }
    // Сразу переходим на следующий шаг
    router.push('/quiz/goals');
  };

  const footerContent = (
    <div className="flex gap-4 w-full max-w-md mx-auto">
      {/* Yes Button */}
      <button
        onClick={() => handleSelect('yes')}
        onTouchEnd={(e) => { e.preventDefault(); handleSelect('yes'); }}
        className="flex-1 flex flex-col items-center justify-center py-4 rounded-xl bg-white border-2 border-gray-300 hover:border-[#6B9D47] hover:bg-[#f0fdf4] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm select-none"
      >
        <span className="text-2xl sm:text-3xl mb-1">👍</span>
        <span className="text-sm sm:text-base font-medium text-gray-700">
          Yes
        </span>
      </button>

      {/* No Button */}
      <button
        onClick={() => handleSelect('no')}
        onTouchEnd={(e) => { e.preventDefault(); handleSelect('no'); }}
        className="flex-1 flex flex-col items-center justify-center py-4 rounded-xl bg-white border-2 border-gray-300 hover:border-[#6B9D47] hover:bg-[#f0fdf4] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm select-none"
      >
        <span className="text-2xl sm:text-3xl mb-1">👎</span>
        <span className="text-sm sm:text-base font-medium text-gray-700">
          No
        </span>
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
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight max-w-[540px] mx-auto [zoom:110%]:text-[min(4vw,2.5rem)] [zoom:125%]:text-[min(3.5vw,2rem)] [zoom:150%]:text-[min(3vw,1.75rem)]">
            Are you part of any groups, clubs, or events where you connect with others who share your interests?
          </h1>
        </div>

        {/* Description */}
        <div className="mb-8 sm:mb-10 text-center">
          <p className="text-gray-600 text-base sm:text-lg md:text-xl [zoom:110%]:text-[min(3vw,1.25rem)] [zoom:125%]:text-[min(2.5vw,1.1rem)] [zoom:150%]:text-[min(2vw,1rem)]">
            Social connections and shared interests can boost your mental well-being.
          </p>
        </div>

        {/* Avocado Image */}
        <div className="flex justify-center mb-8">
          <Image
            src="/jenga-avocados.png"
            alt="Avocados Playing Jenga"
            width={500}
            height={500}
            className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] max-w-[45vh] max-h-[45vh] object-contain"
          />
        </div>
      </div>
    </QuizLayout>
  );
}