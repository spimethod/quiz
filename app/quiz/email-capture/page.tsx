'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import QuizLayout from '../../components/QuizLayout';

const CURRENT_STEP = 31;
const TOTAL_STEPS = 32;

export default function EmailCapturePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [avatar, setAvatar] = useState('girl'); // Default to girl
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailSavedModal, setShowEmailSavedModal] = useState(false);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('avatarPreference');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
    
    // Check if email already exists
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setShowEmailSavedModal(true);
    }
  }, []);

  const validateEmail = (email: string) => {
    // Проверка на английский язык и формат email
    const englishRegex = /^[a-zA-Z0-9@._-]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!englishRegex.test(email)) {
      return 'Please use English characters only';
    }
    
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handleContinue = () => {
    const error = validateEmail(email.trim());
    if (!error && email.trim()) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userEmail', email.trim());
      }
      setIsLoading(true);
      setTimeout(() => {
      router.push('/quiz/personalizing');
      }, 500);
    } else {
      setEmailError(error || 'Please enter a valid email address');
    }
  };

  // Select image based on avatar
  const imageSrc = avatar === 'girl' ? '/avocado-email-capture-girl.png' : '/avocado-email-capture.png';

  return (
    <QuizLayout
      currentStep={CURRENT_STEP}
      totalSteps={TOTAL_STEPS}
      className="px-4 sm:px-6 md:px-8 lg:px-10"
    >
      <div className="max-w-md mx-auto text-center pt-[30px]">
        {/* Title */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4 leading-tight">
            Get Your Personal{' '}<span className="whitespace-nowrap sm:whitespace-normal">Wellness Plan</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mb-6 sm:mb-8">
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            Enter your email to receive science-backed mental health recommendations from{' '}<span className="whitespace-nowrap sm:whitespace-normal">Avocado AI.</span>
          </p>
        </div>

        {/* Email Field */}
        <div className="mb-4 sm:mb-6">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="name@email.com"
            className={`w-full px-4 sm:px-6 py-3 sm:py-4 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6B9D47] focus:border-transparent text-base sm:text-lg bg-white ${
              emailError ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-2 text-center">{emailError}</p>
          )}
        </div>

        {/* Continue Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={handleContinue}
            onTouchEnd={(e) => { if (email.trim() && !emailError && !isLoading) { e.preventDefault(); handleContinue(); } }}
            disabled={!email.trim() || !!emailError || isLoading}
            className={`w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-8 sm:px-12 rounded-xl transition-all duration-300 flex items-center justify-center select-none ${
              email.trim() && !emailError && !isLoading
                ? 'bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
                : isLoading
                ? 'bg-[#6B9D47] text-white cursor-wait'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <svg 
                className="animate-spin h-6 w-6 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="3"
                />
                <path 
                  className="opacity-100" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              'Continue'
            )}
          </button>
        </div>

        {/* Privacy Disclaimer */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start text-left">
            <svg 
              className="w-3 h-3 text-gray-500 mr-2 mt-0.5 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">
              No spam. Unsubscribe in one click. Your data stays private. We respect your privacy and are committed to protecting your personal data according to our Privacy Policy.
            </p>
          </div>
        </div>

        {/* Avocado Character */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <Image
            src={imageSrc}
            alt="Avocado Character"
            width={300}
            height={300}
            priority
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 max-w-[50vw] max-h-[50vw] object-contain"
          />
        </div>

        {/* Benefits List */}
        <div className="text-left mb-8 sm:mb-12 max-w-sm mx-auto">
          <p className="text-sm sm:text-base font-semibold text-gray-800 mb-3">You'll get:</p>
          <ul className="space-y-2 text-sm sm:text-base text-gray-700">
            <li className="flex items-start">
              <div className="w-4 h-4 bg-[#6B9D47] rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>3–5 minute practices for stress relief, better sleep, and focus</span>
            </li>
            <li className="flex items-start">
              <div className="w-4 h-4 bg-[#6B9D47] rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>CBT/ACT micro-steps and guided journaling prompts</span>
            </li>
            <li className="flex items-start">
              <div className="w-4 h-4 bg-[#6B9D47] rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Breathing and grounding audios for instant calm</span>
            </li>
            <li className="flex items-start">
              <div className="w-4 h-4 bg-[#6B9D47] rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Once-a-day personalized tips based on your check-ins</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Email Already Saved Modal */}
      <AnimatePresence>
        {showEmailSavedModal && (
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
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 text-center">Your email is already saved</h3>
              <p className="text-gray-600 mb-6 text-justify leading-relaxed">
                We've already received and saved your email. You can continue right where you left off — no need to enter it again.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowEmailSavedModal(false)}
                  onTouchEnd={(e) => { e.preventDefault(); setShowEmailSavedModal(false); }}
                  className="flex-1 py-3 rounded-xl border-2 border-[#6B9D47] text-[#6B9D47] font-semibold hover:bg-[#6B9D47]/10 transition-all hover:scale-105 active:scale-95 select-none"
                >
                  Change Email
                </button>
                <button 
                  onClick={() => router.push('/quiz/personalizing')}
                  onTouchEnd={(e) => { e.preventDefault(); router.push('/quiz/personalizing'); }}
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
