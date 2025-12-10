'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QuizLayout from '../../components/QuizLayout';

// Total steps before email capture
const TOTAL_STEPS = 12;
const CURRENT_STEP = 4;

export default function NamePage() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleContinue = () => {
    if (name.trim()) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userName', name.trim());
      }
      router.push('/quiz/personal-plan');
    }
  };

  const footerContent = (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={handleContinue}
        disabled={!name.trim()}
        className={`w-full font-semibold text-base sm:text-lg md:text-xl py-3 rounded-xl transition-all duration-300 ${
          name.trim()
            ? 'bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
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
      className="px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col items-center"
    >
      <div className="max-w-md w-full mx-auto flex flex-col items-center pt-4 sm:pt-8 h-full">
        
        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-[#1a1a1a] leading-tight mb-6 sm:mb-8 px-4">
          What name should Avo<br />call you?
        </h1>

        {/* Input */}
        <div className="w-full px-4 mb-6 sm:mb-8">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 sm:py-4 rounded-xl border-2 border-[#6B9D47] bg-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B9D47] focus:border-transparent transition-all text-center sm:text-left text-gray-900"
            autoFocus
          />
        </div>

        {/* Avocado Image - Increased size and moved closer to input */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex-shrink-0 mb-6 mx-auto mt-4 sm:mt-8">
          <Image
            src="/name-avocado.png"
            alt="Avocado asking for name"
            fill
            className="object-contain"
            priority
          />
        </div>

      </div>
    </QuizLayout>
  );
}
