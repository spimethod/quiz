'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QuizLayout from '../../components/QuizLayout';

// Total steps before email capture
const TOTAL_STEPS = 12;
const CURRENT_STEP = 5;

export default function PersonalPlanPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/quiz/feelings');
  };

  return (
    <QuizLayout
      currentStep={CURRENT_STEP}
      totalSteps={TOTAL_STEPS}
      className="!px-0 !pb-0 flex flex-col"
    >
      <div className="flex flex-col h-full relative bg-[#f5f5f0] overflow-hidden">
        
        {/* Картинка */}
        {/* Увеличен контейнер вниз, чтобы картинка заходила под карточку */}
        <div className="absolute top-0 left-0 right-0 bottom-24 flex justify-center items-center z-0">
           <div className="relative w-full h-full max-w-lg">
             <Image
               src="/personal-plan-avocado.png"
               alt="Avocado Plan"
               fill
               className="object-contain object-center scale-[1.7] translate-y-36"
               priority
             />
           </div>
        </div>

        {/* Нижняя карточка */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center sm:pb-6 pointer-events-none z-10">
          <div className="bg-white w-full sm:max-w-[500px] rounded-t-[40px] sm:rounded-[40px] px-6 pt-10 pb-8 sm:pb-10 shadow-[0_-10px_60px_rgba(0,0,0,0.08)] pointer-events-auto">
            <div className="max-w-md mx-auto text-center">
              <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4 leading-tight">
                Avocado builds a personal mental-health plan just for you
              </h1>
              
              <p className="text-gray-500 text-sm sm:text-base mb-8 leading-relaxed px-2 font-medium">
                Reach your goal faster with your 3D AI companion built on the latest <span className="font-bold text-gray-800">psychological science</span>
              </p>

              <button
                onClick={handleContinue}
                onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
                className="w-full font-semibold text-base sm:text-lg md:text-xl py-3.5 rounded-xl transition-all duration-300 bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer select-none"
              >
                Continue
              </button>
            </div>
          </div>
        </div>

      </div>
    </QuizLayout>
  );
}
