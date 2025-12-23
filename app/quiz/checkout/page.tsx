'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'annual'>('weekly');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCvvTooltip, setShowCvvTooltip] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  useEffect(() => {
    // Get selected plan from localStorage
    const plan = localStorage.getItem('selectedPlan');
    if (plan === 'annual' || plan === 'weekly') {
      setSelectedPlan(plan);
    }

    // Push a dummy state to handle back button
    window.history.pushState({ checkout: true }, '');

    // Handle back button
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      // Push state again to prevent actual navigation
      window.history.pushState({ checkout: true }, '');
      setShowDiscountModal(true);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const price = selectedPlan === 'weekly' ? '0.59' : '69.99';
  const currency = 'USD';

  const handleClose = () => {
    setShowDiscountModal(true);
  };

  const handleGotIt = () => {
    // Save that user saw discount offer - redirect to paywall-2
    localStorage.setItem('sawDiscountOffer', 'true');
    router.push('/quiz/paywall-2');
  };

  const handleRemindLater = () => {
    router.push('/quiz/paywall');
  };

  const handlePay = () => {
    // Handle payment logic
    console.log('Processing payment...');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
    >
      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-3xl p-8 sm:p-10 w-full max-w-md mx-auto shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] text-center mb-5">
              Did you know?
            </h2>
            
            {/* Description */}
            <p className="text-gray-600 text-center text-lg sm:text-xl leading-relaxed mb-8">
              Many Avocado members who log their progress report a noticeable boost in well-being within the first month
            </p>
            
            {/* Well-being level */}
            <p className="text-center font-bold text-lg text-[#1a1a1a] mb-5">Well-being level</p>
            
            {/* Graph Image */}
            <div className="flex justify-center mb-5">
              <Image
                src="/discount-graph.png"
                alt="Well-being graph"
                width={500}
                height={375}
                className="w-full max-w-[340px] h-auto object-contain"
              />
            </div>
            
            {/* Disclaimer */}
            <p className="text-gray-400 text-sm text-center italic mb-8">
              Based on self-reported check-ins of users who track progress in the app.
            </p>
            
            {/* Discount message */}
            <div className="bg-[#f5f5f0] rounded-xl p-4 mb-6">
              <p className="text-center text-[#1a1a1a]">
                We want you to succeed — here's an additional discount on your{' '}
                <span className="text-[#6B9D47] font-semibold">Avocado Plan</span>
              </p>
            </div>
            
            {/* Got it button */}
            <button
              onClick={handleGotIt}
              onTouchEnd={(e) => { e.preventDefault(); handleGotIt(); }}
              className="w-full h-14 rounded-full bg-[#6B9D47] hover:bg-[#5d8a3d] transition-all duration-300 flex items-center justify-center text-white font-bold text-lg hover:scale-105 active:scale-95 select-none"
            >
              Got it
            </button>
          </motion.div>
        </div>
      )}
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header with close button */}
        <div className="p-4">
          <button
            onClick={handleClose}
            onTouchEnd={(e) => { e.preventDefault(); handleClose(); }}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors select-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="px-6 pb-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-[#1a1a1a] text-center mb-8">
          Join <span className="text-[#22C55E]">over 100,000</span> users to achieve your goals
        </h1>

        {/* Order Summary */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-gray-500 pb-3 border-b border-gray-200">
            <span>Personalized Plan</span>
            <span>{price} {currency}</span>
          </div>
          <div className="flex justify-between items-center pt-3 pb-4">
            <span className="font-bold text-lg text-[#1a1a1a]">Total</span>
            <span className="font-bold text-lg text-[#1a1a1a]">{price} {currency}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          {/* Google Pay Button */}
          <button 
            onClick={handlePay}
            onTouchEnd={(e) => { e.preventDefault(); handlePay(); }}
            className="w-full h-14 rounded-full bg-[#F3BC00] hover:bg-[#e0ad00] transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 select-none"
          >
            <Image
              src="/gpay.png"
              alt="Google Pay"
              width={140}
              height={56}
              className="h-12 w-auto object-contain"
            />
          </button>

          {/* Apple Pay Button */}
          <button 
            onClick={handlePay}
            onTouchEnd={(e) => { e.preventDefault(); handlePay(); }}
            className="w-full h-14 rounded-full bg-black hover:bg-gray-800 transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 select-none"
          >
            <svg className="w-7 h-7 text-white -mr-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span className="text-white font-medium text-lg">Pay</span>
          </button>
        </div>

        {/* Card Form */}
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
          {/* Card Number */}
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Credit or Debit Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              autoComplete="off"
              className="w-full text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>
          
          {/* Expiry and CVV */}
          <div className="flex">
            <div className="flex-1 p-4 border-r border-gray-200">
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                  if (val.length >= 2) {
                    setExpiryDate(val.slice(0, 2) + '/' + val.slice(2));
                  } else {
                    setExpiryDate(val);
                  }
                }}
                autoComplete="off"
                className="w-full text-gray-700 placeholder-gray-400 outline-none"
              />
            </div>
            <div className="flex-1 p-4 flex items-center">
              <input
                type="text"
                inputMode="numeric"
                placeholder="CVV/CVC"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                autoComplete="off"
                className="flex-1 text-gray-700 placeholder-gray-400 outline-none"
              />
              <div className="relative">
                <div 
                  className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold ml-2 cursor-pointer hover:bg-gray-400 transition-colors"
                  onMouseEnter={() => setShowCvvTooltip(true)}
                  onMouseLeave={() => setShowCvvTooltip(false)}
                  onClick={() => setShowCvvTooltip(!showCvvTooltip)}
                >
                  i
                </div>
                {showCvvTooltip && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 w-48 z-50">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="w-12 h-3 bg-gray-300 rounded"></div>
                        <div className="text-[10px] text-gray-500">123</div>
                      </div>
                      <div className="text-gray-400">/</div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-[10px] text-gray-400">AMEX</div>
                        <div className="border border-gray-400 rounded px-1.5 py-0.5 text-[10px] font-medium">1234</div>
                      </div>
                    </div>
                    <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          onTouchEnd={(e) => { e.preventDefault(); handlePay(); }}
          className="w-full h-14 rounded-full bg-[#6B9D47] hover:bg-[#5d8a3d] transition-all duration-300 flex items-center justify-center gap-2 text-white font-semibold text-lg mb-6 hover:scale-105 active:scale-95 select-none"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          PAY
        </button>

        {/* Pay Safe & Secure */}
        <div className="flex items-center justify-center gap-2 text-[#6B9D47]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="font-medium">Pay Safe & Secure</span>
        </div>
        </div>
      </div>
    </motion.div>
  );
}

