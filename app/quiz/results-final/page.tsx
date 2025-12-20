'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function ResultsFinalPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContinue = () => {
    // Navigate to rating page
    router.push('/quiz/rating');
  };

  // Spring scroll effect - bounce back when overscrolled
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const container = containerRef.current;
    if (!container) return;

    let lastScrollTop = 0;
    let rafId: number | null = null;

    const checkAndSpringBack = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      
      // If scrolled above top, spring back
      if (scrollTop < 0) {
        // Cancel any pending animation
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        
        // Smooth scroll back
        rafId = requestAnimationFrame(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          
          // Force immediate reset as well
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          
          rafId = null;
        });
      }
      
      lastScrollTop = scrollTop;
    };

    // Listen to scroll events
    const handleScroll = () => {
      checkAndSpringBack();
    };

    // Listen to touch end for immediate response
    const handleTouchEnd = () => {
      setTimeout(() => {
        checkAndSpringBack();
      }, 50);
    };

    // Continuous monitoring
    const monitorInterval = setInterval(() => {
      checkAndSpringBack();
    }, 500);

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });

    return () => {
      clearInterval(monitorInterval);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', handleScroll, { capture: true });
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#f5f5f0] flex flex-col overflow-hidden"
      style={{ 
        overscrollBehaviorY: 'auto',
        WebkitOverflowScrolling: 'touch',
        position: 'relative'
      }}
    >
      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-4 sm:pt-6 pb-2 bg-[#f5f5f0] safe-area-top">
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
      <main className="flex-grow-0 px-7 sm:px-9 md:px-11 lg:px-13 lg:pb-24 pt-16 sm:pt-20">
        <div className="max-w-[480px] w-full mx-auto">
          {/* Title */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Your personalized insights are ready!
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl mt-3">
              Avocado AI Assistant
            </p>
          </div>

          {/* Content Container */}
          <div className="flex items-end gap-0 sm:gap-4 mb-16 sm:mb-8">
            {/* Small Avocado Logo */}
            <div className="flex-shrink-0 -ml-4 sm:ml-0">
              <Image
                src="/avocado-chat-logo.png"
                alt="Avocado"
                width={32}
                height={40}
                priority
                className="h-10 w-8"
              />
            </div>
            
            {/* Insights Content - fixed height with scroll */}
            <div className="bg-gradient-to-b from-yellow-100 to-green-100 rounded-2xl px-8 py-6 sm:px-10 sm:py-8 max-w-[520px] sm:max-w-[400px] flex-1 h-[calc(100vh-450px)] sm:h-[calc(100vh-400px)] overflow-y-auto">
              <div className="space-y-4 sm:space-y-6 text-gray-800 text-base sm:text-lg leading-relaxed">
                <p>
                  Nightmares jolt you awake again. You're doing your best while nights steal your rest and daylight energy.
                </p>
                <p>
                  Nighttime terrors lose power when you name three calm things you see; whisper them aloud right now.
                </p>
                <p>
                  Better nights are closer than they feel—many dreamers here halve their wake-ups within a week. Tap below to find your calm inside the app.
                </p>
                <p>
                  This is additional test content to see how the text field stretches the background. Let's add more paragraphs to understand the behavior better and see if the gradient background follows the content height.
                </p>
                <p>
                  Another paragraph to test the stretching behavior. The more content we add, the more we can observe how the background gradient responds to the text content inside the container.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Continue Button */}
      <footer className="pb-6 lg:fixed lg:bottom-0 lg:left-0 lg:right-0 lg:bg-[#f5f5f0] lg:pt-4 lg:pb-6">
        <div className="w-[calc(100%-3rem)] sm:w-[calc(100%-4rem)] max-w-sm mx-auto">
          <button
            onClick={handleContinue}
            onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
            className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 sm:py-4 px-12 sm:px-16 md:px-20 rounded-xl bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 select-none"
          >
            Continue my journey
          </button>
        </div>
      </footer>
    </div>
  );
}
