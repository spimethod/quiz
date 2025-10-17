'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EmailCapturePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

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
      router.push('/quiz/personalizing');
    } else {
      setEmailError(error || 'Please enter a valid email address');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 pt-2 sm:pt-4 pb-0 px-8 sm:px-10 md:px-12 lg:px-6 relative">
        {/* Back Arrow */}
        <button
          onClick={() => router.back()}
          className="absolute left-8 sm:left-20 md:left-40 lg:left-52 top-3 sm:top-5 p-1.5 sm:p-2 hover:bg-gray-200 rounded-full transition-all duration-200 hover:scale-110 z-10"
          aria-label="Go back"
        >
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-800" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="max-w-md mx-auto text-center">
          {/* Title */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Get Your Personal Wellness Plan
            </h1>
          </div>

          {/* Subtitle */}
          <div className="mb-6 sm:mb-8">
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
              Enter your email to receive science-backed mental health recommendations from Avocado AI.
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
              disabled={!email.trim() || !!emailError}
              className={`w-full font-semibold text-base sm:text-lg md:text-xl py-3 sm:py-4 px-8 sm:px-12 rounded-xl transition-all duration-300 ${
                email.trim() && !emailError
                  ? 'bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue
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
              src="/avocado-email-capture.png"
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
      </main>

    </div>
  );
}
