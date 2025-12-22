'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import QuizLayout from '../../components/QuizLayout';

export default function CommitmentPage() {
  const router = useRouter();
  const CURRENT_STEP = 29;
  const TOTAL_STEPS = 32;
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [avatar, setAvatar] = useState('girl'); // Default to girl
  const [isAlreadyCommitted, setIsAlreadyCommitted] = useState(false);

  useEffect(() => {
    // Check avatar preference
    const savedAvatar = localStorage.getItem('avatarPreference');
    if (savedAvatar === 'boy') {
      setAvatar('boy');
    } else {
      setAvatar('girl');
    }
    
    // Check if already committed
    const committed = localStorage.getItem('commitmentSigned');
    if (committed === 'true') {
      setIsAlreadyCommitted(true);
    }
  }, []);

  // Progress tracking during hold
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHolding && holdProgress < 100) {
      interval = setInterval(() => {
        setHoldProgress(prev => {
          const newProgress = prev + 5; // 5% every 100ms = 2 seconds to 100%
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 100);
    } else if (!isHolding) {
      // Reset on release
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding, holdProgress]);

  // Auto-transition when progress reaches 95% (smoother transition without pause)
  useEffect(() => {
    if (holdProgress >= 95) {
      // Save commitment flag
      localStorage.setItem('commitmentSigned', 'true');
      router.push('/quiz/personalizing');
    }
  }, [holdProgress, router]);

  const handleMouseDown = () => setIsHolding(true);
  const handleMouseUp = () => setIsHolding(false);
  const handleTouchStart = () => setIsHolding(true);
  const handleTouchEnd = () => setIsHolding(false);

  const handleContinue = () => {
    router.push('/quiz/personalizing');
  };

  const hideInstructions = holdProgress > 0;

  return (
    <QuizLayout
      currentStep={CURRENT_STEP}
      totalSteps={TOTAL_STEPS}
      className="px-4 sm:px-6 md:px-8 lg:px-10"
      hideBackButton={isAlreadyCommitted}
    >
      {/* Already Committed Overlay */}
      {isAlreadyCommitted && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          {/* Semi-transparent white overlay */}
          <div className="absolute inset-0 bg-white/50" />
          
          {/* Signed Contract Image Container with Navigation */}
          <div className="relative z-50 -mt-40 sm:-mt-24 md:mt-0">
            {/* Back Button - Mobile (Bottom Left) / Desktop (Left Side) */}
            <button
              onClick={() => router.back()}
              className="absolute left-4 -bottom-20 lg:left-[-80px] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-50 p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Go back"
            >
              <svg 
                className="w-14 h-14 lg:w-8 lg:h-8 text-gray-700" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          
            {/* Forward Button - Mobile (Bottom Right) / Desktop (Right Side) */}
            <button
              onClick={() => router.push('/quiz/personalizing')}
              className="absolute right-4 -bottom-20 lg:right-[-80px] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-50 p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Go forward"
            >
              <svg 
                className="w-14 h-14 lg:w-8 lg:h-8 text-gray-700" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          
            <Image
              src="/commitment-signed-v2.png"
              alt="Commitment Signed"
              width={1080}
              height={1440}
              className="w-[90vw] sm:w-[70vw] md:w-[57vw] max-w-[720px] h-auto object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      )}

      <div className="max-w-[600px] w-full mx-auto text-center pt-[30px]">
        
        {/* Title */}
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4 leading-tight">
          I commit to caring for my mental health every day
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-base sm:text-lg mb-8 sm:mb-10 max-w-md mx-auto">
          And build balance and calm with my<br />Avocado companion
        </p>

        {/* Avocado Images - Based on Avatar Selection */}
        <div className="flex justify-center mb-10 sm:mb-12">
          {avatar === 'boy' ? (
            <>
              {/* Boy Version - Mobile & Tablet (< 1024px) */}
              <div className="relative block lg:hidden -translate-y-[2px]">
                <Image
                  src="/commitment-avocado.png"
                  alt="Commitment Avocado"
                  width={360}
                  height={460}
                  className="w-68 h-auto max-w-[68vw] object-contain"
                  priority
                />

                {/* Soft pulsing glow around button */}
                <div className="absolute left-1/2 top-[calc(58%+11px)] min-[300px]:top-[calc(58%+16px)] min-[390px]:top-[calc(58%+21px)] -translate-x-1/2 -translate-y-1/2 w-[52%] aspect-square pointer-events-none z-5">
                  <motion.div
                    animate={{
                      scale: [1, 1.28, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(107,157,71,0.9) 0%, rgba(107,157,71,0.7) 40%, rgba(107,157,71,0) 70%)'
                    }}
                  />
                </div>

                {/* Button positioned at center of belly - sized to match pit */}
                <button
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                  onContextMenu={(e) => e.preventDefault()}
                  className="absolute left-1/2 top-[calc(58%+11px)] min-[300px]:top-[calc(58%+16px)] min-[390px]:top-[calc(58%+21px)] -translate-x-1/2 -translate-y-1/2 w-[52%] aspect-square cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 rounded-full focus:outline-none z-10 select-none"
                  style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
                  aria-label="Hold to commit"
                >
                  <Image
                    src="/commit-button-mobile.png"
                    alt="Commit Button"
                    fill
                    className="object-contain pointer-events-none select-none"
                    priority
                    draggable={false}
                  />
                </button>

                {/* Animated Stamp Overlay */}
                <div className="absolute left-1/2 top-[calc(58%+11px)] min-[300px]:top-[calc(58%+16px)] min-[390px]:top-[calc(58%+21px)] -translate-x-1/2 -translate-y-1/2 w-[52%] aspect-square pointer-events-none z-20">
                  <motion.div
                    animate={{
                      scale: 1 + (holdProgress / 100) * 7,
                      opacity: holdProgress > 0 ? 1 : 0
                    }}
                    transition={{ duration: 0.1 }}
                    className="w-full h-full"
                  >
                    <Image
                      src="/commitment-stamp.png"
                      alt="Commitment Stamp"
                      fill
                      className="object-contain"
                      priority
                    />
                  </motion.div>
                </div>
              </div>
              
              {/* Boy Version - Web (>= 1024px) */}
              <div className="relative hidden lg:block -translate-y-[5px]">
                <Image
                  src="/commitment-avocado-web.png"
                  alt="Commitment Avocado Web"
                  width={360}
                  height={460}
                  className="w-72 h-auto md:w-[22rem] object-contain"
                  priority
                />

                {/* Soft pulsing glow around button - Desktop */}
                <div className="absolute left-1/2 top-[calc(58%+26px)] -translate-x-1/2 -translate-y-1/2 w-[52%] aspect-square pointer-events-none z-5">
                  <motion.div
                    animate={{
                      scale: [1, 1.28, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(107,157,71,0.9) 0%, rgba(107,157,71,0.7) 40%, rgba(107,157,71,0) 70%)'
                    }}
                  />
                </div>

                {/* Button positioned at center of belly - sized to match pit */}
                <button
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  className="absolute left-1/2 top-[calc(58%+26px)] -translate-x-1/2 -translate-y-1/2 w-[52%] aspect-square cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 rounded-full focus:outline-none z-10"
                  aria-label="Hold to commit"
                >
                  <Image
                    src="/commit-button-web.png"
                    alt="Commit Button Web"
                    fill
                    className="object-contain"
                    priority
                  />
                </button>

                {/* Animated Stamp Overlay */}
                <div className="absolute left-1/2 top-[calc(58%+31px)] -translate-x-1/2 -translate-y-1/2 w-[52%] aspect-square pointer-events-none z-20">
                  <motion.div
                    animate={{
                      scale: 1 + (holdProgress / 100) * 7,
                      opacity: holdProgress > 0 ? 1 : 0
                    }}
                    transition={{ duration: 0.1 }}
                    className="w-full h-full"
                  >
                    <Image
                      src="/commitment-stamp.png"
                      alt="Commitment Stamp"
                      fill
                      className="object-contain"
                      priority
                    />
                  </motion.div>
                </div>
              </div>
            </>
          ) : (
            /* Girl Version - Universal (Mobile/Tablet/Web) - Using Aspect Ratio Container */
            <div className="relative mx-auto w-72 sm:w-84 md:w-[26rem] max-w-[78vw] aspect-[4876/5396] translate-x-[30px]">
              <div className="absolute inset-0 scale-108 -translate-x-[10.3%] -translate-y-[1.4%]">
                <Image
                  src="/commitment-avocado-girl.png"
                  alt="Commitment Avocado Girl"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Soft pulsing glow around button - Girl Version */}
              <div className="absolute left-[42.3%] top-[66.8%] -translate-x-1/2 -translate-y-1/2 w-[55%] aspect-square pointer-events-none z-5">
                <motion.div
                  animate={{
                    scale: [1, 1.28, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(107,157,71,0.9) 0%, rgba(107,157,71,0.7) 40%, rgba(107,157,71,0) 70%)'
                  }}
                />
              </div>

              {/* Button positioned at center of belly */}
              <button
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                onContextMenu={(e) => e.preventDefault()}
                className="absolute left-[42.3%] top-[66.8%] -translate-x-1/2 -translate-y-1/2 w-[55%] aspect-square cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 rounded-full focus:outline-none z-10 select-none"
                style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
                aria-label="Hold to commit"
              >
                <Image
                  src="/commit-button-mobile.png"
                  alt="Commit Button"
                  fill
                  className="object-contain lg:hidden pointer-events-none select-none"
                  priority
                  draggable={false}
                />
                <Image
                  src="/commit-button-web.png"
                  alt="Commit Button"
                  fill
                  className="object-contain hidden lg:block pointer-events-none select-none"
                  priority
                  draggable={false}
                />
              </button>

              {/* Animated Stamp Overlay */}
              <div className="absolute left-[42.3%] top-[66.8%] -translate-x-1/2 -translate-y-1/2 w-[55%] aspect-square pointer-events-none z-50">
                <motion.div
                  animate={{
                    scale: 1 + (holdProgress / 100) * 7,
                    opacity: holdProgress > 0 ? 1 : 0
                  }}
                  transition={{ duration: 0.1 }}
                  className="w-full h-full"
                >
                  <Image
                    src="/commitment-stamp.png"
                    alt="Commitment Stamp"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* Instruction with Animated Arrow */}
        <div className={`relative flex flex-col items-center ${avatar === 'girl' ? 'ml-[calc(-9%+46px)]' : ''} ${hideInstructions ? 'opacity-0' : 'opacity-100'} transition-opacity duration-150`}>
          {/* Animated Green Arrow pointing up */}
          <div className="mb-1 sm:mb-2">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut"
              }}
            >
              <svg className="w-8 h-12 sm:w-10 sm:h-14 text-[#6B9D47]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L8 6h3v10h2V6h3L12 2z"/>
              </svg>
            </motion.div>
          </div>
          
          {/* Mobile & Tablet Text (< 1024px) */}
          <p className="text-[#6B9D47] text-base sm:text-lg font-semibold block lg:hidden text-center">
            Tap and hold the Avocado pit to commit
          </p>
          
          {/* Web Text (>= 1024px) */}
          <p className="text-[#6B9D47] text-base sm:text-lg font-semibold hidden lg:block text-center">
            Click and hold the Avocado pit to commit
          </p>
        </div>

      </div>
    </QuizLayout>
  );
}
