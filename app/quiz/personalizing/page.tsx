'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PersonalizingPage() {
  const router = useRouter();
  
  // Initialize state with default values
  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const [progress3, setProgress3] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Set client flag
    setIsClient(true);
    
    // Load progress from localStorage on client side
    const savedProgress1 = localStorage.getItem('personalizing-progress1');
    const savedProgress2 = localStorage.getItem('personalizing-progress2');
    const savedProgress3 = localStorage.getItem('personalizing-progress3');
    
    let initialProgress1 = 0;
    let initialProgress2 = 0;
    let initialProgress3 = 0;
    
    if (savedProgress1) {
      initialProgress1 = parseInt(savedProgress1);
      setProgress1(initialProgress1);
    }
    if (savedProgress2) {
      initialProgress2 = parseInt(savedProgress2);
      setProgress2(initialProgress2);
    }
    if (savedProgress3) {
      initialProgress3 = parseInt(savedProgress3);
      setProgress3(initialProgress3);
    }

    // Check if this is a page refresh (not navigation from previous page)
    const isPageRefresh = !sessionStorage.getItem('personalizing-visited');
    const hasNavigatedFromBeforeAfter = document.referrer.includes('/quiz/before-after') || 
                                       window.history.length > 1;
    
    if (isPageRefresh && !hasNavigatedFromBeforeAfter) {
      // If it's a refresh and not from before-after page, redirect back
      router.back();
      return;
    }

    // Mark that we've visited this page
    sessionStorage.setItem('personalizing-visited', 'true');

    // Only start timers if progress is not already complete
    if (initialProgress1 < 100) {
      const timer1 = setTimeout(() => {
        setCurrentStep(2);
        let step = 0;
        const interval1 = setInterval(() => {
          step++;
          // Non-linear progression: starts fast, slows down
          const progress = Math.min(100, Math.round(100 * (1 - Math.pow(0.95, step))));
          setProgress1(progress);
          localStorage.setItem('personalizing-progress1', progress.toString());
          
          if (progress >= 100) {
            clearInterval(interval1);
          }
        }, 100);

        return () => clearInterval(interval1);
      }, 1000); // Start first progress after 1 second
    } else {
      setCurrentStep(2);
    }

    if (initialProgress2 < 100) {
      const timer2 = setTimeout(() => {
        setCurrentStep(3);
        let step = 0;
        const interval2 = setInterval(() => {
          step++;
          // Non-linear progression: starts fast, slows down
          const progress = Math.min(100, Math.round(100 * (1 - Math.pow(0.95, step))));
          setProgress2(progress);
          localStorage.setItem('personalizing-progress2', progress.toString());
          
          if (progress >= 100) {
            clearInterval(interval2);
          }
        }, 100);

        return () => clearInterval(interval2);
      }, 6000); // Start second progress after 6 seconds
    } else {
      setCurrentStep(3);
    }

    if (initialProgress3 < 100) {
      const timer3 = setTimeout(() => {
        setCurrentStep(4);
        let step = 0;
        const interval3 = setInterval(() => {
          step++;
          // Non-linear progression: starts fast, slows down
          const progress = Math.min(100, Math.round(100 * (1 - Math.pow(0.95, step))));
          setProgress3(progress);
          localStorage.setItem('personalizing-progress3', progress.toString());
          
          if (progress >= 100) {
            clearInterval(interval3);
          }
        }, 100);

        return () => clearInterval(interval3);
      }, 11000); // Start third progress after 11 seconds
    } else {
      setCurrentStep(4);
    }

    return () => {
      // Cleanup is handled by individual timer variables
    };
  }, [router]);

  const handleContinue = () => {
    // Clear localStorage when continuing
    localStorage.removeItem('personalizing-progress1');
    localStorage.removeItem('personalizing-progress2');
    localStorage.removeItem('personalizing-progress3');
    router.push('/quiz/rating');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="relative pt-4 sm:pt-6 pb-2">
        <div className="flex justify-center items-center">
          <div className="flex items-center space-x-2" style={{ marginLeft: '-30px' }}>
            <Image
              src="/avocado-logo.png"
              alt="Avocado"
              width={280}
              height={90}
              priority
              className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow-0 px-6 sm:px-8 md:px-12 lg:px-10 pb-24">
        <div className="max-w-[660px] w-full mx-auto">
          {/* Title */}
          <div className="mb-8 sm:mb-12 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Personalizing your experience...
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl mt-4">
              Avocado is analyzing your responses to tailor recommendations<br />just for you!
            </p>
          </div>

          {/* Progress Items */}
          <div className="space-y-6 sm:space-y-8">
            {/* Progress Item 1 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-base sm:text-lg font-medium">
                  Checking your needs...
                </span>
                <span className="text-[#6B9D47] text-sm sm:text-base font-semibold">
                  {isClient ? progress1 : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                <div 
                  className="bg-[#6B9D47] h-2 sm:h-3 rounded-full transition-all duration-100 ease-linear"
                  style={{ width: `${isClient ? progress1 : 0}%` }}
                />
              </div>
            </div>

            {/* Progress Item 2 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-base sm:text-lg font-medium">
                  Understanding your goals...
                </span>
                <span className="text-[#6B9D47] text-sm sm:text-base font-semibold">
                  {isClient ? progress2 : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                <div 
                  className="bg-[#6B9D47] h-2 sm:h-3 rounded-full transition-all duration-100 ease-linear"
                  style={{ width: `${isClient ? progress2 : 0}%` }}
                />
              </div>
            </div>

            {/* Progress Item 3 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-base sm:text-lg font-medium">
                  Finalizing your personalized plan...
                </span>
                <span className="text-[#6B9D47] text-sm sm:text-base font-semibold">
                  {isClient ? progress3 : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                <div 
                  className="bg-[#6B9D47] h-2 sm:h-3 rounded-full transition-all duration-100 ease-linear"
                  style={{ width: `${isClient ? progress3 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Continue Button */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#f5f5f0] pt-4 pb-6">
        <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4rem)] max-w-sm mx-auto">
          <button
            onClick={handleContinue}
            disabled={progress1 < 100 || progress2 < 100 || progress3 < 100}
            className={`w-full font-semibold text-base sm:text-lg md:text-xl py-3 sm:py-4 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 ${
              progress1 >= 100 && progress2 >= 100 && progress3 >= 100
                ? 'bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Let's see your results
          </button>
        </div>
      </footer>
    </div>
  );
}