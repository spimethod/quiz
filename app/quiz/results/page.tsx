'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import QuizLayout from '../../components/QuizLayout';

export default function ResultsPage() {
  const router = useRouter();
  const CURRENT_STEP = 28;
  const TOTAL_STEPS = 32;

  const [avatar, setAvatar] = useState<'girl' | 'boy'>('girl');
  const [isPortrait, setIsPortrait] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAvatar = localStorage.getItem('avatarPreference') as 'girl' | 'boy' | null;
      if (savedAvatar) {
        setAvatar(savedAvatar);
      }

      // Check initial orientation
      const checkOrientation = () => {
        const portrait = window.innerHeight > window.innerWidth;
        setIsPortrait(portrait);
        
        // Apply scroll prevention with a small delay to ensure elements are rendered
        setTimeout(() => {
          // Find the root container from QuizLayout (the div with h-screen)
          const container = document.querySelector('[data-results-container] > div') as HTMLElement;
          const mainElement = document.querySelector('[data-results-container] main') as HTMLElement;
          
          if (portrait) {
            // Portrait: prevent scroll completely
            if (container) {
              container.style.overflow = 'hidden';
              container.style.touchAction = 'none';
              container.style.overscrollBehavior = 'none';
              container.style.height = '100vh';
              container.style.position = 'fixed';
              container.style.top = '0';
              container.style.left = '0';
              container.style.right = '0';
              container.style.bottom = '0';
            }
            if (mainElement) {
              mainElement.style.overflow = 'hidden';
              mainElement.style.touchAction = 'none';
              mainElement.style.overscrollBehavior = 'none';
            }
          } else {
            // Landscape: allow normal scroll
            if (container) {
              container.style.overflow = '';
              container.style.touchAction = '';
              container.style.overscrollBehavior = '';
              container.style.height = '';
              container.style.position = '';
              container.style.top = '';
              container.style.left = '';
              container.style.right = '';
              container.style.bottom = '';
            }
            if (mainElement) {
              mainElement.style.overflow = '';
              mainElement.style.touchAction = '';
              mainElement.style.overscrollBehavior = '';
            }
          }
        }, 100);
      };
      
      checkOrientation();
      
      // Listen for orientation changes
      window.addEventListener('resize', checkOrientation);
      window.addEventListener('orientationchange', checkOrientation);
      
      return () => {
        window.removeEventListener('resize', checkOrientation);
        window.removeEventListener('orientationchange', checkOrientation);
        
        // Reset styles on cleanup
        const container = document.querySelector('[data-results-container] > div') as HTMLElement;
        const mainElement = document.querySelector('[data-results-container] main') as HTMLElement;
        
        if (container) {
          container.style.overflow = '';
          container.style.touchAction = '';
          container.style.overscrollBehavior = '';
          container.style.height = '';
          container.style.position = '';
          container.style.top = '';
          container.style.left = '';
          container.style.right = '';
          container.style.bottom = '';
        }
        if (mainElement) {
          mainElement.style.overflow = '';
          mainElement.style.touchAction = '';
          mainElement.style.overscrollBehavior = '';
        }
      };
    }
  }, []);

  const avatarImage = avatar === 'girl' 
    ? '/results-avocado-girl.png' 
    : '/results-avocado.png';

  const handleContinue = () => {
    router.push('/quiz/commitment');
  };

  const footerContent = (
    <div className="max-w-sm mx-auto w-full">
      <button
        onClick={handleContinue}
        onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
        className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer select-none"
      >
        Continue
      </button>
    </div>
  );

  return (
    <div data-results-container>
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
            82% of users feel relief within 4 weeks
          </h1>
        </div>

        {/* Description */}
        <div className="mb-8 sm:mb-10 text-center">
          <p className="text-gray-600 text-base sm:text-lg md:text-xl [zoom:110%]:text-[min(3vw,1.25rem)] [zoom:125%]:text-[min(2.5vw,1.1rem)] [zoom:150%]:text-[min(2vw,1rem)]">
            You're doing great! Most people who use Avocado start feeling better in just a few weeks. Let's keep going — a few more quick questions and we'll personalize your journey!
          </p>
        </div>

        {/* Avocado Image */}
        <div className="flex justify-center mb-8">
          <Image
            src={avatarImage}
            alt="Avocado with Results Chart"
            width={600}
            height={600}
            className="w-80 h-80 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] lg:w-[450px] lg:h-[450px] max-w-[50vh] max-h-[50vh] object-contain"
          />
        </div>
      </div>
    </QuizLayout>
    </div>
  );
}