'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QuizLayout from '../../components/QuizLayout';

export default function SupportSystemPage() {
  const router = useRouter();
  const [selectedButton, setSelectedButton] = useState<'yes' | 'no' | null>(null);
  const CURRENT_STEP = 14;
  const TOTAL_STEPS = 32;

  const handleSelect = (option: 'yes' | 'no') => {
    setSelectedButton(option);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('supportSystem', option);
      }
      router.push('/quiz/why-avocado');
    }, 300);
  };

  const footerContent = (
    <div className="flex gap-4 w-full max-w-md mx-auto">
      {/* Yes Button */}
      <button
        onClick={() => handleSelect('yes')}
        onTouchEnd={(e) => { e.preventDefault(); handleSelect('yes'); }}
        className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm select-none ${
          selectedButton === 'yes'
            ? 'border-[#6B9D47] bg-[#6B9D47]/10'
            : 'bg-white border-gray-300 hover:border-[#6B9D47] hover:bg-[#6B9D47]/10'
        }`}
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
        className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl bg-white border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm select-none ${
          selectedButton === 'no'
            ? 'border-[#6B9D47] bg-[#f0fdf4]'
            : 'border-gray-300 hover:border-[#6B9D47] hover:bg-[#f0fdf4]'
        }`}
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
      <div className="max-w-[660px] w-full mx-auto pt-[30px]">
        {/* Title */}
        <div className="mb-3 sm:mb-4 mt-4 sm:mt-6 text-center">
          <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 leading-tight max-w-[540px] mx-auto [zoom:110%]:text-[min(4vw,2.5rem)] [zoom:125%]:text-[min(3.5vw,2rem)] [zoom:150%]:text-[min(3vw,1.75rem)]">
            Do you have close friends or family you feel comfortable talking to about your feelings?
          </h1>
        </div>

        {/* Description */}
        <div className="mb-8 sm:mb-10 text-center">
          <p className="text-gray-600 text-base sm:text-lg md:text-xl [zoom:110%]:text-[min(3vw,1.25rem)] [zoom:125%]:text-[min(2.5vw,1.1rem)] [zoom:150%]:text-[min(2vw,1rem)]">
            Having a support system can make a big difference<br />in your mental health journey.
          </p>
        </div>

        {/* Avocado Image */}
        <div className="flex justify-center mb-8">
          <Image
            src="/friends-avocado.png"
            alt="Avocado with Friends"
            width={500}
            height={500}
            className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] max-w-[45vh] max-h-[45vh] object-contain"
          />
        </div>
      </div>
    </QuizLayout>
  );
}