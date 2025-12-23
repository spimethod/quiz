'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import { getProgressPercentage } from '../../utils/progress';

export default function CustomizationPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const CURRENT_STEP = 25;
  const TOTAL_STEPS = 32;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = [
    { id: 'girl', src: '/custom-avocado-girl.png', alt: 'Avocado Girl', className: 'scale-95 translate-y-6' },
    { id: 'boy', src: '/custom-avocado-boy.png', alt: 'Avocado Boy', className: 'scale-100' },
  ];

  // Читаем выбор пола с первого шага и устанавливаем начальный слайд
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const selectedGender = localStorage.getItem('selectedGender');
      // Если выбран Male -> показываем мальчика (индекс 1)
      // Если выбран Female или нет выбора -> показываем девочку (индекс 0)
      if (selectedGender === 'male') {
        setCurrentSlide(1);
      } else {
        setCurrentSlide(0); // Female или дефолт = девочка
      }
    }
  }, []);

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
      // Reset commitment flag when avatar changes
      localStorage.removeItem('commitmentSigned');
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
      // Reset commitment flag when avatar changes
      localStorage.removeItem('commitmentSigned');
    }
  };

  const handleSelect = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('avatarPreference', slides[currentSlide].id);
    }
    router.push('/quiz/time');
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div
      ref={containerRef}
      data-custom="true"
      className="flex flex-col bg-[#f5f5f0] portrait:fixed portrait:inset-0 portrait:overflow-hidden landscape:min-h-screen landscape:overflow-y-auto landscape:overflow-x-hidden"
      style={{
        overscrollBehavior: 'none'
      }}
    >
      {/* Portrait mode: disable touch scroll */}
      <style jsx>{`
        @media (orientation: portrait) {
          div[data-custom="true"] {
            touch-action: none;
          }
        }
      `}</style>

      {/* Header */}
      <header className="pt-2 pb-0 px-8 bg-[#f5f5f0] relative z-10">
        <BackButton 
          className="absolute left-8 top-3 z-10"
        />
        
        <div className="flex flex-col items-center" style={{ marginLeft: '-30px' }}>
          <div className="flex justify-center mb-1">
            <Image
              src="/avocado-logo.png"
              alt="Avocado"
              width={280}
              height={90}
              priority
              className="h-8 w-auto"
            />
          </div>
          {/* Progress Bar */}
          <div className="w-32 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-[#6B9D47] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${getProgressPercentage(CURRENT_STEP)}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-4 pt-4 text-center">
        <div className="max-w-md w-full mx-auto flex flex-col">
          
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2 leading-tight px-2">
            You can customize your 3D Avocado companion
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 px-2">
            Choose exactly how your AI companion feels — pick the voice, background music, and visual scene that fit you best.
          </p>

          {/* Slider Container */}
          <div className="flex-1 flex flex-col justify-center">
          <div className="relative flex items-center justify-center mb-4 w-full">
            
            {/* Left Arrow */}
            <button 
              onClick={handlePrevSlide}
              onTouchEnd={(e) => { e.preventDefault(); if (currentSlide > 0) handlePrevSlide(); }}
              disabled={currentSlide === 0}
              className={`absolute left-0 z-20 p-2 rounded-full transition-all select-none ${
                currentSlide === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-[#6B9D47]'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Slide Image Container */}
            <div className="relative w-full max-w-[280px] portrait:h-[35vh] landscape:h-[40vh] overflow-hidden">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "tween", duration: 0.3, ease: "easeInOut" },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0 w-full h-full"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={slides[currentSlide].src}
                      alt={slides[currentSlide].alt}
                      fill
                      className={`object-contain object-bottom drop-shadow-xl ${slides[currentSlide].className || ''}`}
                      priority
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Arrow */}
            <button 
              onClick={handleNextSlide}
              onTouchEnd={(e) => { e.preventDefault(); if (currentSlide < slides.length - 1) handleNextSlide(); }}
              disabled={currentSlide === slides.length - 1}
              className={`absolute right-0 z-20 p-2 rounded-full transition-all select-none ${
                currentSlide === slides.length - 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-[#6B9D47]'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mb-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index !== currentSlide) {
                    setDirection(index > currentSlide ? 1 : -1);
                    setCurrentSlide(index);
                    localStorage.removeItem('commitmentSigned');
                  }
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  if (index !== currentSlide) {
                    setDirection(index > currentSlide ? 1 : -1);
                    setCurrentSlide(index);
                    localStorage.removeItem('commitmentSigned');
                  }
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 select-none ${
                  index === currentSlide 
                    ? 'bg-[#6B9D47] w-4' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                style={{ touchAction: 'manipulation' }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 pb-6 pt-3 bg-[#f5f5f0]">
        <div className="max-w-md mx-auto w-full flex justify-center">
          <button
            onClick={handleSelect}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleSelect();
            }}
            className="w-full font-semibold text-lg py-3 px-8 rounded-xl bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 select-none"
          >
            Select
          </button>
        </div>
      </footer>
    </div>
  );
}
