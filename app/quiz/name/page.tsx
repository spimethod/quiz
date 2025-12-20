'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import QuizLayout from '../../components/QuizLayout';

// Total steps before email capture
const TOTAL_STEPS = 32;
const CURRENT_STEP = 30;

export default function NamePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [showNameSavedModal, setShowNameSavedModal] = useState(false);

  useEffect(() => {
    // Check if name already exists
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

  const footerContent = (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={handleContinue}
        onTouchEnd={(e) => { if (name.trim()) { e.preventDefault(); handleContinue(); } }}
        disabled={!name.trim()}
        className={`w-full font-semibold text-base sm:text-lg md:text-xl py-3 rounded-xl transition-all duration-300 select-none ${
          name.trim()
            ? 'bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );

  return (
    <QuizLayout
      currentStep={CURRENT_STEP}
      totalSteps={TOTAL_STEPS}
      footer={footerContent}
      className="px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col items-center"
    >
      <div className="max-w-md w-full mx-auto flex flex-col items-center pt-4 sm:pt-8 h-full">
        
        {/* Title */}
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-center text-[#1a1a1a] leading-tight mb-6 sm:mb-8 px-4">
          What name should Avo<br />call you?
        </h1>

        {/* Input */}
        <div className="w-full px-4 mb-6 sm:mb-8">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 sm:py-4 rounded-xl border-2 border-[#6B9D47] bg-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B9D47] focus:border-transparent transition-all text-center sm:text-left text-gray-900"
            autoFocus
          />
        </div>

        {/* Avocado Image - Increased size and moved closer to input */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex-shrink-0 mb-6 mx-auto mt-4 sm:mt-8">
          <Image
            src="/name-avocado.png"
            alt="Avocado asking for name"
            fill
            className="object-contain"
            priority
          />
        </div>

      </div>

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
              className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-sm mx-auto shadow-xl border-2 border-[#6B9D47]"
            >
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 text-center">Your name is already saved</h3>
              <p className="text-gray-600 mb-6 text-justify leading-relaxed">
                We've already received and saved your name. You can continue right where you left off — no need to enter it again.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowNameSavedModal(false)}
                  onTouchEnd={(e) => { e.preventDefault(); setShowNameSavedModal(false); }}
                  className="flex-1 py-3 rounded-xl border-2 border-[#6B9D47] text-[#6B9D47] font-semibold hover:bg-[#6B9D47]/10 transition-all hover:scale-105 active:scale-95 select-none"
                >
                  Change Name
                </button>
                <button 
                  onClick={() => router.push('/quiz/customization')}
                  onTouchEnd={(e) => { e.preventDefault(); router.push('/quiz/customization'); }}
                  className="flex-1 py-3 rounded-xl bg-[#6B9D47] text-white font-semibold hover:bg-[#5d8a3d] transition-all hover:scale-105 active:scale-95 shadow-md select-none"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </QuizLayout>
  );
}
