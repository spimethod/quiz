'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/BackButton';
import { getProgressPercentage } from '../../utils/progress';

const TOTAL_STEPS = 32;
const CURRENT_STEP = 30;

export default function NamePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [showNameSavedModal, setShowNameSavedModal] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setShowNameSavedModal(true);
    }
  }, []);

  const handleContinue = () => {
    if (name.trim()) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userName', name.trim());
      }
      router.push('/quiz/customization');
    }
  };

  return (
    <div
      ref={containerRef}
      data-name="true"
      className="flex flex-col bg-[#f5f5f0] portrait:fixed portrait:inset-0 portrait:overflow-hidden landscape:min-h-screen landscape:overflow-y-auto landscape:overflow-x-hidden"
      style={{
        overscrollBehavior: 'none'
      }}
    >
      {/* Portrait mode: disable touch scroll */}
      <style jsx>{`
        @media (orientation: portrait) {
          div[data-name="true"] {
            touch-action: none;
          }
        }
      `}</style>

      {/* Header */}
      <header className="pt-[12px] pb-0 px-8 bg-[#f5f5f0] relative z-10">
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
      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-4">
        <div className="max-w-md w-full mx-auto flex flex-col items-center">
          
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#1a1a1a] leading-tight mb-4 px-4">
            What name should Avo<br />call you?
          </h1>

          {/* Input */}
          <div className="w-full px-4 mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#6B9D47] bg-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B9D47] focus:border-transparent transition-all text-center text-gray-900"
              autoFocus
              style={{ fontSize: '16px', touchAction: 'manipulation' }}
            />
          </div>

          {/* Continue Button - under the input field */}
          <div className="w-full px-4 mb-4">
            <button
              onClick={handleContinue}
              onTouchEnd={(e) => { e.preventDefault(); if (name.trim()) handleContinue(); }}
              disabled={!name.trim()}
              className={`w-full font-semibold text-lg py-3 rounded-xl transition-all duration-300 select-none ${
                name.trim()
                  ? 'bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              Continue
            </button>
          </div>

          {/* Avocado Image */}
          <div className="flex justify-center mb-2">
            <Image
              src="/name-avocado.png"
              alt="Avocado asking for name"
              width={500}
              height={500}
              className="portrait:h-[32vh] landscape:h-[28vh] w-auto object-contain"
              priority
            />
          </div>

        </div>
      </main>

      {/* Name Already Saved Modal */}
      <AnimatePresence>
        {showNameSavedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-white/60 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl p-6 w-full max-w-sm mx-auto shadow-xl border-2 border-[#6B9D47]"
            >
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 text-center">Your name is already saved</h3>
              <p className="text-gray-600 mb-6 text-justify leading-relaxed text-sm">
                We've already received and saved your name. You can continue right where you left off — no need to enter it again.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowNameSavedModal(false)}
                  onTouchEnd={(e) => { e.preventDefault(); setShowNameSavedModal(false); }}
                  className="flex-1 py-3 rounded-xl border-2 border-[#6B9D47] text-[#6B9D47] font-semibold hover:bg-[#6B9D47]/10 transition-all hover:scale-105 active:scale-95 select-none"
                  style={{ touchAction: 'manipulation' }}
                >
                  Change Name
                </button>
                <button 
                  onClick={() => router.push('/quiz/customization')}
                  onTouchEnd={(e) => { e.preventDefault(); router.push('/quiz/customization'); }}
                  className="flex-1 py-3 rounded-xl bg-[#6B9D47] text-white font-semibold hover:bg-[#5d8a3d] transition-all hover:scale-105 active:scale-95 shadow-md select-none"
                  style={{ touchAction: 'manipulation' }}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
