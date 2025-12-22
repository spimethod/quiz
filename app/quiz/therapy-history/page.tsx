'use client';

import { useState, type MouseEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QuizLayout from '../../components/QuizLayout';

export default function TherapyHistoryPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const CURRENT_STEP = 17;
  const TOTAL_STEPS = 32;

  const options = [
    'Psychologist',
    'Psychiatrist',
    'Not yet'
  ];

  const handleSelect = (e: MouseEvent<HTMLButtonElement>) => {
    const option = e.currentTarget.getAttribute('data-option');
    if (option) {
      e.preventDefault();
      e.stopPropagation();
      setSelected(option);
    }
  };

  const handleContinue = () => {
    if (selected) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('therapyHistory', selected);
      }
      router.push('/quiz/medical-conditions');
    }
  };

  const footerContent = (
    <div className="max-w-sm mx-auto w-full">
      <button
        onClick={handleContinue}
        disabled={!selected}
        className={`w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 select-none ${
          selected
            ? 'bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        style={{ touchAction: 'manipulation' }}
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
      <div className="max-w-[660px] w-full mx-auto pt-[30px] pb-40">
        {/* Title */}
        <div className="mb-6 sm:mb-8 mt-4 sm:mt-6 text-center">
          <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 leading-tight max-w-[540px] mx-auto [zoom:110%]:text-[min(4vw,2.5rem)] [zoom:125%]:text-[min(3.5vw,2rem)] [zoom:150%]:text-[min(3vw,1.75rem)]">
            Have you worked with anyone before to support your mental health?
          </h1>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6 max-w-md mx-auto">
          {options.map((option) => (
            <button
              key={option}
              data-option={option}
              onClick={handleSelect}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 select-none ${
                selected === option
                  ? 'border-[#6B9D47] bg-[#6B9D47]/10'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <span className={`text-base sm:text-lg font-medium ${
                selected === option ? 'text-[#6B9D47]' : 'text-gray-700'
              }`}>
                {option}
              </span>
              {/* Radio circle */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selected === option
                  ? 'border-[#6B9D47]'
                  : 'border-gray-300'
              }`}>
                {selected === option && (
                  <div className="w-3 h-3 rounded-full bg-[#6B9D47]" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Avocado Image */}
        <div className="flex justify-center mb-0">
          <Image
            src="/therapy-avocado.png"
            alt="Avocado on Therapy Couch"
            width={500}
            height={500}
            className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[350px] lg:h-[350px] max-w-[40vh] max-h-[40vh] object-contain"
          />
        </div>
      </div>
    </QuizLayout>
  );
}

