'use client';

import Image from 'next/image';
import { ReactNode, useEffect, useRef } from 'react';
import BackButton from './BackButton';
import { getProgressPercentage } from '../utils/progress';

interface QuizLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  footer?: ReactNode;
  className?: string;
  hideBackButton?: boolean;
}

export default function QuizLayout({
  children,
  currentStep,
  totalSteps,
  onBack,
  footer,
  className = '',
  hideBackButton = false
}: QuizLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
      className="h-screen flex flex-col bg-[#f5f5f0] overflow-hidden relative"
      style={{ 
        overscrollBehaviorY: 'auto',
        WebkitOverflowScrolling: 'touch',
        position: 'relative'
      }}
    >
      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-2 sm:pt-4 pb-0 px-8 sm:px-10 md:px-12 lg:px-6 bg-[#f5f5f0] safe-area-top">
        {!hideBackButton && (
        <BackButton 
          onClick={onBack}
          className="absolute left-8 sm:left-20 md:left-40 lg:left-52 top-3 sm:top-5 z-10"
        />
        )}
        
        <div className="flex flex-col items-center" style={{ marginLeft: '-30px' }}>
          <div className="flex justify-center mb-1 sm:mb-2">
            <Image
              src="/avocado-logo.png"
              alt="Avocado"
              width={280}
              height={90}
              priority
              className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto"
            />
          </div>
          {/* Progress Bar instead of text */}
          <div className="w-32 sm:w-40 h-1.5 bg-gray-200 rounded-full mt-1 sm:mt-2 overflow-hidden ml-0 sm:ml-5">
            <div 
              className="h-full bg-[#6B9D47] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${getProgressPercentage(currentStep)}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto overflow-x-hidden px-4 pb-32 sm:px-6 md:px-8 lg:px-10 pt-16 sm:pt-20 ${className}`}>
        {children}
      </main>

      {/* Footer (Optional) */}
      {footer && (
        <footer className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-6 pt-4 bg-[#f5f5f0]" style={{ opacity: 1, transform: 'translateY(0)' }}>
          <div className="max-w-2xl mx-auto w-full flex justify-center">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}
