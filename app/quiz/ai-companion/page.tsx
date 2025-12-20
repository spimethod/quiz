'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AICompanionPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [avatar, setAvatar] = useState<'girl' | 'boy'>('girl');
  const [companionType, setCompanionType] = useState<'3d' | 'chat'>('3d');
  const [isMuted, setIsMuted] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAvatar = localStorage.getItem('avatarPreference') as 'girl' | 'boy' | null;
      if (savedAvatar) {
        setAvatar(savedAvatar);
      }
    }
  }, []);

  // Audio setup - optional, only if file exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if audio file exists before creating
      fetch('/audio/companion-intro.mp3', { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            audioRef.current = new Audio('/audio/companion-intro.mp3');
            audioRef.current.loop = false;
          }
        })
        .catch(() => {
          // Audio file doesn't exist, skip
          console.log('Audio file not found, skipping');
        });

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, []);

  const handleReplay = () => {
    setRotationDegrees(prev => prev - 360);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (audioRef.current) {
      audioRef.current.muted = newMutedState;
    }
  };

  const handleContinue = () => {
    // Save companion type preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('companionType', companionType);
    }
    router.push('/quiz/subscription');
  };

  const avatarImage = avatar === 'girl' 
    ? '/ai-companion-girl.png' 
    : '/ai-companion-boy.png';

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
      {/* Header with Logo - Fixed */}
      <header className="fixed top-0 left-0 right-0 pt-4 pb-2 px-4 flex items-center justify-center bg-[#f5f5f0] z-50 safe-area-top">
        <div className="h-12 sm:h-14 md:h-16 w-auto relative">
          <Image
            src="/avocado-logo.png"
            alt="Avocado"
            width={280}
            height={90}
            priority
            className="h-full w-auto object-contain"
          />
        </div>
      </header>

      {/* Main Content - Animated from bottom */}
      <motion.main 
        className="flex-1 flex flex-col items-center px-4 overflow-y-auto pt-16 sm:pt-20"
        initial={{ y: '100vh', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-md w-full mx-auto flex flex-col items-center">
          {/* Title */}
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] text-center mb-2 mt-4">
            Your personalized insights are ready!
          </h1>

          {/* Subtitle */}
          <p className="text-gray-500 text-base sm:text-lg mb-6">
            Avocado AI Assistant
          </p>

          {/* Avatar Image */}
          <div className="w-full max-w-sm mb-6">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={avatarImage}
                alt="AI Companion"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex justify-center gap-12 mb-8">
            {/* Replay Button */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleReplay}
                onTouchEnd={(e) => { e.preventDefault(); handleReplay(); }}
                className="w-14 h-14 rounded-full bg-[#7da35e] hover:bg-[#6b8f4f] flex items-center justify-center text-white transition-all duration-200 shadow-md active:scale-95 cursor-pointer select-none"
              >
                <svg 
                  className="w-7 h-7 transition-transform duration-500"
                  style={{ transform: `rotate(${rotationDegrees}deg)` }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Replay</span>
            </div>

            {/* Mute Button */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleMuteToggle}
                onTouchEnd={(e) => { e.preventDefault(); handleMuteToggle(); }}
                className="w-14 h-14 rounded-full bg-[#7da35e] hover:bg-[#6b8f4f] flex items-center justify-center text-white transition-all duration-200 shadow-md active:scale-95 cursor-pointer relative select-none"
              >
                {isMuted ? (
                  <div className="relative">
                    <svg className="w-7 h-7 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <div className="absolute top-1/2 left-[-20%] w-[140%] h-0.5 bg-white rotate-45 transform -translate-y-1/2 shadow-sm"></div>
                  </div>
                ) : (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Mute</span>
            </div>
          </div>

          {/* Companion Type Switcher */}
          <div className="w-full max-w-sm mb-8">
            <div className="relative bg-[#e8f0e0] rounded-full p-1 flex">
              {/* Sliding background */}
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#7da35e] rounded-full transition-all duration-300 ease-out shadow-md ${
                  companionType === 'chat' ? 'left-[calc(50%+2px)]' : 'left-1'
                }`}
              />
              
              {/* 3D AI Companion Option */}
              <button
                onClick={() => setCompanionType('3d')}
                onTouchEnd={(e) => { e.preventDefault(); setCompanionType('3d'); }}
                className={`relative z-10 flex-1 py-3 px-4 text-sm font-semibold rounded-full transition-colors duration-300 select-none ${
                  companionType === '3d' ? 'text-white' : 'text-[#6b8f4f]'
                }`}
              >
                3D AI Companion
              </button>
              
              {/* AI Companion Chat Option */}
              <button
                onClick={() => setCompanionType('chat')}
                onTouchEnd={(e) => { e.preventDefault(); setCompanionType('chat'); }}
                className={`relative z-10 flex-1 py-3 px-4 text-sm font-semibold rounded-full transition-colors duration-300 select-none ${
                  companionType === 'chat' ? 'text-white' : 'text-[#6b8f4f]'
                }`}
              >
                AI Companion Chat
              </button>
            </div>
          </div>
        </div>
      </motion.main>

      {/* Footer Button - Also animated */}
      <footer 
        className="flex-shrink-0 p-4 bg-gradient-to-t from-[#f5f5f0] via-[#f5f5f0] to-transparent pt-8"
        style={{ opacity: 1, transform: 'translateY(0)' }}
      >
        <div className="max-w-md mx-auto">
          <button
            onClick={handleContinue}
            onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
            className="w-full font-semibold text-lg sm:text-xl py-3 rounded-xl transition-all duration-300 bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer select-none"
          >
            Continue my journey
          </button>
        </div>
      </footer>
    </div>
  );
}

