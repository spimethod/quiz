'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BackButton from '../../components/BackButton';
import { getProgressPercentage } from '../../utils/progress';
import { useVoiceRecorder } from '../../utils/useVoiceRecorder';

export default function MedicationsPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [showInput, setShowInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [shouldAutoFocus, setShouldAutoFocus] = useState(false);
  const [selectedButton, setSelectedButton] = useState<'yes' | 'no' | null>(null);
  const customInputRef = useRef<HTMLDivElement>(null);
  const continueBtnRef = useRef<HTMLButtonElement>(null);
  const CURRENT_STEP = 16;
  const TOTAL_STEPS = 32;

  // Voice recorder hook
  const { 
    isRecording, 
    isProcessing, 
    startRecording, 
    stopRecording,
    error: recorderError 
  } = useVoiceRecorder((text) => {
    setCustomValue(text);
  }, () => customValue);

  const handleNo = () => {
    setSelectedButton('no');
    setTimeout(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medications', JSON.stringify({ taking: false, details: '' }));
    }
    router.push('/quiz/therapy-history');
    }, 300);
  };

  const handleYes = () => {
    setSelectedButton('yes');
    setTimeout(() => {
    setShowInput(true);
    setShouldAutoFocus(true);
      setSelectedButton(null);
    }, 300);
  };

  const handleMicClick = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const handleContinue = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medications', JSON.stringify({ 
        taking: true, 
        details: customValue.trim() 
      }));
    }
    router.push('/quiz/therapy-history');
  };

  // Click outside handler (except Continue button)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideInput = customInputRef.current?.contains(target);
      const clickedContinue = continueBtnRef.current?.contains(target);
      if (!clickedInsideInput && !clickedContinue) {
        setShowInput(false);
        if (isRecording) {
          stopRecording();
        }
        setShouldAutoFocus(false);
      }
    };

    if (showInput) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showInput]);

  // Scroll to Continue button when custom field opens
  useEffect(() => {
    if (showInput && continueBtnRef.current) {
      setTimeout(() => {
        const button = continueBtnRef.current;
        if (button) {
          const rect = button.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetScroll = scrollTop + rect.top - (window.innerHeight - rect.height - 100);
          window.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  }, [showInput]);

  // Dynamically enable/disable touch scroll and overflow based on showInput state
  useEffect(() => {
    const container = containerRef.current;
    const main = mainRef.current;
    if (!container || !main) return;

    if (showInput) {
      container.style.touchAction = 'auto';
      main.style.overflowY = 'auto';
    } else {
      container.style.touchAction = 'none';
      main.style.overflowY = 'hidden';
    }
  }, [showInput]);

  const footerContent = !showInput ? (
    <div className="max-w-md mx-auto w-full">
      {/* Yes/No Buttons */}
        <div className="flex gap-4 w-full">
          {/* Yes Button */}
          <button
            onClick={handleYes}
            onTouchEnd={(e) => { e.preventDefault(); handleYes(); }}
            className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm select-none ${
              selectedButton === 'yes'
                ? 'border-[#6B9D47] bg-[#6B9D47]/10'
                : 'bg-white border-gray-300 hover:border-[#6B9D47] hover:bg-[#6B9D47]/10'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            <span className="text-2xl sm:text-3xl mb-1">💊</span>
            <span className="text-sm sm:text-base font-medium text-gray-700">
              Yes
            </span>
          </button>

          {/* No Button */}
          <button
            onClick={handleNo}
            onTouchEnd={(e) => { e.preventDefault(); handleNo(); }}
            className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm select-none ${
              selectedButton === 'no'
                ? 'border-[#6B9D47] bg-[#6B9D47]/10'
                : 'bg-white border-gray-300 hover:border-[#6B9D47] hover:bg-[#6B9D47]/10'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            <span className="text-2xl sm:text-3xl mb-1">🫙</span>
            <span className="text-sm sm:text-base font-medium text-gray-700">
              No
            </span>
          </button>
        </div>
    </div>
  ) : null;

  return (
    <div
      ref={containerRef}
      data-medications="true"
      className="flex flex-col bg-[#f5f5f0] portrait:fixed portrait:inset-0 landscape:min-h-screen landscape:overflow-y-auto landscape:overflow-x-hidden"
      style={{
        overscrollBehavior: 'none'
      }}
    >
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
      <main ref={mainRef} className="flex-1 flex flex-col px-4 pt-4 pb-32 overflow-x-hidden">
        <div className="max-w-md w-full mx-auto">
          {/* Title */}
          <div className="mb-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight px-2">
              Are you currently taking any medications?
            </h1>
          </div>

          {/* Description */}
          <div className="mb-12 text-center">
            <p className="text-gray-600 text-sm px-2">
              This helps me offer support that's just right for you.
            </p>
          </div>

          {/* Avocado Image */}
          <div className="flex justify-center mb-2">
          <Image
            src="/medications-avocado.png"
            alt="Avocado Doctor with Medications"
            width={500}
            height={500}
            className="portrait:h-[35vh] landscape:h-[30vh] w-auto object-contain"
            priority
          />
        </div>

        {/* Custom Input Field - Shows when Yes is clicked */}
        {showInput && (
          <div ref={customInputRef} className="w-full max-w-md mx-auto mb-0">
            <div className={`relative border-2 ${customValue.trim() ? 'border-[#6B9D47]' : 'border-gray-300'} rounded-3xl p-4 bg-white`}>
              <textarea
                value={customValue}
                onChange={(e) => {
                  setCustomValue(e.target.value);
                  // Если микрофон записывает, останавливаем его при ручном редактировании
                  if (isRecording) {
                    stopRecording();
                  }
                }}
                onFocus={(e) => {
                  // Prevent zoom on iOS
                  if (e.target instanceof HTMLTextAreaElement) {
                    e.target.style.fontSize = '16px';
                  }
                  // Если микрофон записывает, останавливаем его при фокусе на поле
                  if (isRecording) {
                    stopRecording();
                  }
                }}
                placeholder={
                  isProcessing 
                    ? "Processing..." 
                    : isRecording 
                    ? "Speak please..." 
                    : "Tell us about your medications..."
                }
                className="w-full h-32 bg-transparent outline-none resize-none overflow-y-auto pr-14 text-sm sm:text-base text-gray-700 placeholder-gray-400"
                autoFocus={shouldAutoFocus}
                style={{ fontSize: '16px' }}
                disabled={isProcessing}
              />
              {/* Microphone button - top right corner */}
              <button
                onClick={handleMicClick}
                className={`absolute top-3 right-3 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-[#6B9D47] animate-pulse shadow-lg' 
                    : 'bg-[#6B9D47] hover:bg-[#5d8a3d] shadow-md'
                }`}
              >
                {/* Microphone SVG Icon */}
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
                  />
                </svg>
              </button>
            </div>
            {/* Error message */}
            {recorderError && (
              <div className="mt-2 text-sm text-red-500 text-center">
                {recorderError}
              </div>
            )}
          </div>
        )}
        </div>
      </main>

      {/* Footer - appears when NOT expanded */}
      {footerContent && (
        <footer className="px-4 pb-6 pt-3 bg-[#f5f5f0] relative z-20">
          {footerContent}
        </footer>
      )}

      {/* Floating Continue Button - appears when custom field is expanded */}
      {showInput && (
        <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-6 pt-2 bg-[#f5f5f0] animate-slide-up">
          <div className="max-w-sm mx-auto w-full">
            <button
              ref={continueBtnRef}
              onClick={handleContinue}
              onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
              className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 select-none bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              style={{ touchAction: 'manipulation' }}
            >
              Continue
              </button>
            </div>
            {/* Error message */}
            {recorderError && (
              <div className="mt-2 text-sm text-red-500 text-center">
                {recorderError}
              </div>
            )}
          </div>
        )}
        </div>
  );
}

