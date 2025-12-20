'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SubscriptionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');

  const handleContinue = () => {
    // Store subscription choice
    localStorage.setItem('subscriptionPlan', selectedPlan);
    // TODO: Implement subscription logic
    console.log('Subscription plan selected:', selectedPlan);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col">
      {/* Header */}
      <header className="px-7 sm:px-9 md:px-11 lg:px-13 pt-2 pb-2">
        <div className="flex items-center justify-end">
          <button
            onClick={handleBack}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow-0 px-7 sm:px-9 md:px-11 lg:px-13 pt-0">
        <div className="max-w-sm mx-auto">
          {/* Avocado Logo */}
          <div className="text-center mb-4">
            <Image
              src="/avocado-logo.png"
              alt="Avocado"
              width={200}
              height={60}
              priority
              className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto mx-auto"
            />
          </div>

          {/* Title and Description */}
          <div className="text-center mb-4 max-w-lg mx-auto">
            <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">
              Your Step-by-Step Mental Health Plan
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base">
              Guided by Avocado — your AI companion built on the latest psychological science. Short daily practices to reduce stress, improve sleep, and boost focus — all designed to strengthen your mental health.
            </p>
          </div>

          {/* Meditation Illustration */}
          <div className="text-center mb-6">
            <Image
              src="/meditation-illustration.png"
              alt="Meditation"
              width={200}
              height={200}
              priority
              className="mx-auto"
            />
          </div>

          {/* Subscription Options */}
          <div className="space-y-3 mb-8">
            {/* Annual Plan */}
            <div 
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedPlan === 'annual' 
                  ? 'border-[#6B9D47] bg-green-50' 
                  : 'border-gray-200 bg-white'
              }`}
              onClick={() => setSelectedPlan('annual')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedPlan === 'annual' 
                      ? 'border-[#6B9D47] bg-[#6B9D47]' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {selectedPlan === 'annual' && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Annual</p>
                    <p className="text-sm text-gray-600">12 mo • $69.99</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-[#6B9D47] text-white text-xs font-bold px-2 py-1 rounded-md mb-1">
                    19% OFF
                  </div>
                  <p className="font-semibold text-gray-900">$5.83/mo</p>
                </div>
              </div>
            </div>

            {/* Monthly Plan */}
            <div 
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedPlan === 'monthly' 
                  ? 'border-[#6B9D47] bg-green-50' 
                  : 'border-gray-200 bg-white'
              }`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedPlan === 'monthly' 
                      ? 'border-[#6B9D47] bg-[#6B9D47]' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {selectedPlan === 'monthly' && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Monthly</p>
                    <p className="text-sm text-gray-600">1 mo • $9.99</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">$9.99/mo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-6 px-4 sm:px-6 sm:fixed sm:bottom-0 sm:left-0 sm:right-0 sm:bg-[#f5f5f0] sm:pt-4 sm:pb-6">
        <div className="max-w-sm mx-auto">
          <button
            onClick={handleContinue}
            onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
            className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 sm:px-16 md:px-20 rounded-xl bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 select-none"
          >
            Continue
          </button>
        </div>
      </footer>
    </div>
  );
}
