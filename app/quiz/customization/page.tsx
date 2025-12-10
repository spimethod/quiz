'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import QuizLayout from '../../components/QuizLayout';

export default function CustomizationPage() {
  const router = useRouter();
  const CURRENT_STEP = 25;
  const TOTAL_STEPS = 32;

  const [currentSlide, setCurrentSlide] = useState(0); // Девочка по умолчанию
  const [direction, setDirection] = useState(0);

  const slides = [
    { id: 'girl', src: '/custom-avocado-girl.png', alt: 'Avocado Girl', className: 'translate-y-[11px]' },
    { id: 'boy', src: '/custom-avocado-boy.png', alt: 'Avocado Boy', className: 'scale-105 origin-bottom' },
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
    router.push('/quiz/before-after');
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

  const footerContent = (
    <div className="max-w-sm mx-auto w-full">
      <button
        onClick={handleSelect}
        className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 rounded-xl bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300"
      >
        Select
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
      <div className="max-w-[600px] w-full mx-auto text-center pt-4 sm:pt-6 flex flex-col h-full">
        
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4 leading-tight">
          You can customize your 3D Avocado companion
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-8 max-w-lg mx-auto">
          Choose exactly how your AI companion feels — pick the voice, background music, and visual scene that fit you best.
        </p>

        {/* Slider Container */}
        <div className="flex-grow flex flex-col justify-center">
          <div className="relative flex items-center justify-center mb-6 sm:mb-8 w-full">
            
            {/* Left Arrow */}
            <button 
              onClick={handlePrevSlide}
              disabled={currentSlide === 0}
              className={`absolute left-0 sm:-left-8 md:-left-12 z-20 p-2 rounded-full transition-all ${
                currentSlide === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-[#6B9D47]'
              }`}
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Slide Image Container */}
            <div className="relative w-full max-w-[400px] sm:max-w-[450px] h-[350px] sm:h-[450px] overflow-hidden">
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
              disabled={currentSlide === slides.length - 1}
              className={`absolute right-0 sm:-right-8 md:-right-12 z-20 p-2 rounded-full transition-all ${
                currentSlide === slides.length - 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-[#6B9D47]'
              }`}
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mb-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index !== currentSlide) {
                    setDirection(index > currentSlide ? 1 : -1);
                    setCurrentSlide(index);
                    // Reset commitment flag when avatar changes
                    localStorage.removeItem('commitmentSigned');
                  }
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-[#6B9D47] w-4' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </QuizLayout>
  );
}
