'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BackButton from '../../components/BackButton';
import { getProgressPercentage } from '../../utils/progress';
import { useVoiceRecorder } from '../../utils/useVoiceRecorder';

// Total steps before email capture
const TOTAL_STEPS = 12;
const CURRENT_STEP = 6;

// Reordered to fit better in 3 rows on mobile (shorter options first for better distribution)
const predefinedOptions = [
  'Low self-esteem',
  'Depression',
  'Sleep issues',
  'Loneliness',
  'Lack of focus',
  'Procrastination',
  'Social anxiety',
  'Negative thoughts',
  'Burnout',
];

export default function FeelingsPage() {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [customValue, setCustomValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldAutoFocus, setShouldAutoFocus] = useState(false);
  const customInputRef = useRef<HTMLDivElement>(null);
  const continueBtnRef = useRef<HTMLButtonElement>(null);

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

  const handleOptionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const option = e.currentTarget.dataset.option;
    if (!option) return;
    
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
    } else {
        return [...prev, option];
    }
    });
  };

  const handleAddCustom = () => {
    if (customValue.trim()) {
      setSelectedOptions([...selectedOptions, customValue.trim()]);
      setCustomValue('');
      if (isRecording) {
        stopRecording();
      }
      setShouldAutoFocus(false);
    }
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
      // Include custom value if entered but not yet added
      const allFeelings = customValue.trim() 
        ? [...selectedOptions, customValue.trim()]
        : selectedOptions;
      localStorage.setItem('userFeelings', JSON.stringify(allFeelings));
    }
    // Do not collapse custom input on submit; keep current expanded state
    router.push('/quiz/pace');
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideInput = customInputRef.current?.contains(target);
      const clickedContinue = continueBtnRef.current?.contains(target);
      if (!clickedInsideInput && !clickedContinue) {
        setIsExpanded(false);
        if (isRecording) {
          stopRecording();
        }
        setShouldAutoFocus(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isExpanded, isRecording, stopRecording]);

  // Scroll to bottom on initial load (when no options selected) - guaranteed approach
  useEffect(() => {
    // Only run on initial mount when nothing is selected and input is not expanded
    if (selectedOptions.length === 0 && !customValue.trim() && !isExpanded) {
      let scrollTimeout: NodeJS.Timeout | null = null;
      let lastHeight = 0;
      let stableCount = 0;
      let isScrolling = false; // Flag to prevent multiple simultaneous scrolls
      const STABLE_THRESHOLD = 3; // Number of consecutive stable measurements
      
      const performScroll = () => {
        if (isScrolling) return; // Prevent concurrent scrolls
        if (isExpanded || selectedOptions.length > 0 || customValue.trim()) return; // Don't scroll if conditions changed
        
        isScrolling = true;
        const customInput = customInputRef.current;
        const currentHeight = document.documentElement.scrollHeight;
        
        if (customInput) {
          const rect = customInput.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetScroll = scrollTop + rect.bottom - window.innerHeight;
          
          window.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: 'auto'
          });
        } else {
          // Fallback: scroll to absolute bottom
          window.scrollTo({
            top: currentHeight - window.innerHeight,
            behavior: 'auto'
          });
        }
        
        setTimeout(() => {
          isScrolling = false;
        }, 100);
      };
      
      const checkAndScroll = () => {
        // Don't check if input is expanded or user has made selections
        if (isExpanded || selectedOptions.length > 0 || customValue.trim()) {
          return true; // Stop checking
        }
        
        const currentHeight = document.documentElement.scrollHeight;
        
        // Check if height is stable (not changing)
        if (currentHeight === lastHeight) {
          stableCount++;
          if (stableCount >= STABLE_THRESHOLD) {
            // Height is stable, perform scroll
            performScroll();
            return true; // Indicate we're done
          }
        } else {
          // Height changed, reset counter
          stableCount = 0;
          lastHeight = currentHeight;
        }
        
        return false; // Not stable yet, keep checking
      };
      
      // Initial scroll attempts
      const attemptScroll = () => {
        if (!checkAndScroll()) {
          // If not stable, schedule next check
          scrollTimeout = setTimeout(attemptScroll, 100);
        }
      };
      
      // Start checking immediately
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          attemptScroll();
        });
      });
      
      // Use MutationObserver to detect DOM changes, but ignore textarea content changes
      const observer = new MutationObserver((mutations) => {
        // Ignore mutations inside textarea (characterData changes)
        const hasTextareaChanges = mutations.some(mutation => {
          const target = mutation.target as HTMLElement;
          return target.tagName === 'TEXTAREA' || target.closest('textarea');
        });
        
        if (hasTextareaChanges) return; // Skip scroll when textarea content changes
        
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
        attemptScroll();
      });
      
      // Observe changes in the document body, but exclude textarea
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
        characterData: false // Don't track text changes
      });
      
      // Use ResizeObserver to detect size changes, but only observe main content, not textarea
      let resizeObserver: ResizeObserver | null = null;
      if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver((entries) => {
          // Ignore resize events from textarea
          const hasTextareaResize = entries.some(entry => {
            const target = entry.target as HTMLElement;
            return target.tagName === 'TEXTAREA' || target.closest('textarea');
          });
          
          if (hasTextareaResize) return; // Skip scroll when textarea resizes
          
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }
          attemptScroll();
        });
        
        // Only observe main content area, not textarea
        const mainContent = document.querySelector('main');
        if (mainContent) {
          resizeObserver.observe(mainContent);
        }
      }
      
      // Also listen to window load
      const handleLoad = () => {
        setTimeout(() => {
          performScroll();
        }, 200);
      };
      
      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
      }
      
      // Final scroll after a longer delay as safety net
      setTimeout(() => {
        performScroll();
      }, 1500);
      
      return () => {
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
        observer.disconnect();
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
        window.removeEventListener('load', handleLoad);
      };
    }
  }, [selectedOptions, customValue, isExpanded]); // Depend on these to stop when conditions change

  // Scroll up when Continue button appears (only when collapsing input, not during typing)
  useEffect(() => {
    const hasSelection = selectedOptions.length > 0 || customValue.trim();
    // Only scroll when collapsing expanded input, not during active typing
    if (hasSelection && !isExpanded) {
      // Use a debounce to avoid scrolling on every keystroke
      const timeoutId = setTimeout(() => {
        const footer = document.querySelector('footer');
        if (footer && !isExpanded) {
          footer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 300); // Debounce to avoid scrolling during typing
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedOptions, isExpanded]); // Removed customValue from dependencies to prevent scroll on every keystroke

  // Hide footer when expanded, show floating button instead
  useEffect(() => {
    const footer = document.querySelector('footer') as HTMLElement | null;
    if (!footer) return;

    if (isExpanded) {
      footer.style.display = 'none';
    } else {
      footer.style.display = '';
    }

    return () => {
      footer.style.display = '';
    };
  }, [isExpanded]);

  // Simple scroll: just scroll input container to top of screen when expanded
  useEffect(() => {
    if (!isExpanded || !customInputRef.current) return;

    // Use scrollIntoView with block: 'start' to position input at top
    const scrollToInput = () => {
      if (customInputRef.current) {
        customInputRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    // Initial scroll after DOM update
    const timeoutId = setTimeout(scrollToInput, 150);

    // Re-scroll when keyboard opens/closes
    if (window.visualViewport) {
      const handleViewportChange = () => {
        setTimeout(scrollToInput, 100);
      };
      
      window.visualViewport.addEventListener('resize', handleViewportChange);
      
      return () => {
        clearTimeout(timeoutId);
        window.visualViewport?.removeEventListener('resize', handleViewportChange);
      };
    }

    return () => clearTimeout(timeoutId);
  }, [isExpanded]);

  // Reduce padding under Continue button when keyboard is open
  useEffect(() => {
    if (!isExpanded || !(selectedOptions.length > 0 || customValue.trim())) return;

    const adjustPadding = () => {
      const continueButtonContainer = document.getElementById('continue-button-container');
      if (!continueButtonContainer) return;

      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.innerHeight;
      const keyboardOpen = windowHeight - viewportHeight > 150;

      if (keyboardOpen) {
        continueButtonContainer.style.paddingBottom = '4px';
        continueButtonContainer.style.paddingTop = '4px';
      } else {
        continueButtonContainer.style.paddingBottom = '';
        continueButtonContainer.style.paddingTop = '';
      }
    };

    const timeoutId = setTimeout(adjustPadding, 100);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', adjustPadding);
      return () => {
        clearTimeout(timeoutId);
        window.visualViewport?.removeEventListener('resize', adjustPadding);
      };
    } else {
      window.addEventListener('resize', adjustPadding);
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', adjustPadding);
      };
    }
  }, [isExpanded, selectedOptions, customValue]);

  const footerContent = !isExpanded && (selectedOptions.length > 0 || customValue.trim()) ? (
    <div className="max-w-sm mx-auto w-full">
      <button
        onClick={handleContinue}
        onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
        ref={continueBtnRef}
        className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 select-none bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
      >
        Continue
      </button>
    </div>
  ) : null;

  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to Continue button when it appears (expanded state with selections)
  useEffect(() => {
    if (isExpanded && (selectedOptions.length > 0 || customValue.trim()) && continueBtnRef.current) {
      // Wait for button to render, then scroll with extra offset to clear browser UI
      setTimeout(() => {
        const button = continueBtnRef.current;
        if (button) {
          const rect = button.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          // Add 100px extra offset to ensure button clears browser UI
          const targetScroll = scrollTop + rect.top - (window.innerHeight - rect.height - 100);
          window.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  }, [isExpanded, selectedOptions.length, customValue]);

  // Dynamically enable/disable touch scroll based on state
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const shouldAllowScroll = isExpanded || selectedOptions.length > 0;
    
    // Only control touch-action, overflow is always auto for content scrolling
    container.style.touchAction = shouldAllowScroll ? 'auto' : 'none';
  }, [isExpanded, selectedOptions.length]);

  return (
    <div
      ref={containerRef}
      data-feelings="true"
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
      <main className="flex-1 flex flex-col px-4 pt-4 pb-32 overflow-y-auto overflow-x-hidden">
        <div className="max-w-[660px] w-full mx-auto">
        {/* Title */}
        <div className="mb-3 sm:mb-4 mt-4 sm:mt-6 text-center">
          <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 leading-tight [zoom:110%]:text-[min(4vw,2.5rem)] [zoom:125%]:text-[min(3.5vw,2rem)] [zoom:150%]:text-[min(3vw,1.75rem)]">
            Have you noticed any feelings or challenges in the past three months?
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mb-4 sm:mb-6 text-center">
          <p className="text-sm sm:text-base text-gray-600 max-w-[660px] mx-auto [zoom:110%]:text-[min(2.5vw,1.1rem)] [zoom:125%]:text-[min(2.2vw,1rem)] [zoom:150%]:text-[min(2vw,0.9rem)]">
            Awareness is the first step to feeling better. Let's check in with how you've been
          </p>
        </div>

        {/* Avocado Image */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="relative w-56 h-56 sm:w-60 sm:h-60 md:w-72 md:h-72 max-w-[38vh] max-h-[38vh] [zoom:110%]:w-[min(25vh,240px)] [zoom:110%]:h-[min(25vh,240px)] [zoom:125%]:w-[min(22vh,220px)] [zoom:125%]:h-[min(22vh,220px)] [zoom:150%]:w-[min(20vh,200px)] [zoom:150%]:h-[min(20vh,200px)]">
            <Image
              src="/feelings-bg.png"
              alt="Feelings Avocado"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Options Grid */}
        <div className={`mb-4 sm:mb-6 ${isExpanded ? 'mb-0' : ''}`}>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-4">
            {predefinedOptions.map((option) => {
              const isSelected = selectedOptions.includes(option);
              return (
              <button
                key={option}
                  type="button"
                  data-option={option}
                  onClick={handleOptionClick}
                  className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-200 select-none flex-shrink-0 [zoom:110%]:text-[min(2.5vw,1.1rem)] [zoom:110%]:px-3.5 [zoom:110%]:py-2.5 [zoom:125%]:text-[min(2.2vw,1rem)] [zoom:125%]:px-3 [zoom:125%]:py-2 [zoom:150%]:text-[min(2vw,0.9rem)] [zoom:150%]:px-2.5 [zoom:150%]:py-1.5 ${
                    isSelected
                    ? 'bg-[#6B9D47] text-white shadow-md scale-105'
                    : 'bg-white text-gray-800 border border-gray-300 hover:border-[#6B9D47] hover:scale-105'
                }`}
                  style={{ 
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
              >
                {option}
              </button>
              );
            })}
          </div>

          {/* Custom Input - Collapsed/Expanded */}
          <div ref={customInputRef} className={`w-full max-w-md mx-auto ${isExpanded ? 'mb-0' : ''}`}>
            {!isExpanded ? (
              /* Collapsed: Input + Button in one line */
            <div 
              className={`flex items-center gap-2 border-2 ${customValue.trim() ? 'border-[#6B9D47]' : 'border-gray-300'} rounded-full px-4 py-2.5 bg-white cursor-text`}
            >
                <input
                  type="text"
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
                  if (e.target instanceof HTMLInputElement) {
                    e.target.style.fontSize = '16px';
                  }
                  // Если микрофон записывает, останавливаем его при фокусе на поле
                  if (isRecording) {
                    stopRecording();
                  }
                  setIsExpanded(true);
                  setShouldAutoFocus(true);
                }}
                onClick={() => {
                  setIsExpanded(true);
                  setShouldAutoFocus(true);
                }}
                  placeholder="+ Add Your Own"
                  className="flex-1 bg-transparent outline-none text-sm sm:text-base text-gray-700 placeholder-gray-400 cursor-text"
                  style={{ fontSize: '16px' }}
                />
                <button
                onClick={async () => {
                  setIsExpanded(true);
                  await startRecording();
                  setShouldAutoFocus(false);
                  }}
                  className="bg-[#6B9D47] hover:bg-[#5d8a3d] text-white px-5 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all shadow-sm hover:shadow-md flex-shrink-0"
                >
                  Start talking
                </button>
              </div>
            ) : (
              /* Expanded: Textarea + Mic button */
              <div className={`relative border-2 ${customValue.trim() ? 'border-[#6B9D47]' : 'border-gray-300'} rounded-3xl p-4 bg-white`}>
                <textarea
                  value={customValue}
                  onChange={(e) => {
                    setCustomValue(e.target.value);
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
                      : "Type please..."
                  }
                  className="w-full h-32 bg-transparent outline-none resize-none overflow-y-auto pr-14 text-sm sm:text-base text-gray-700 placeholder-gray-400"
                autoFocus={shouldAutoFocus}
                style={{ fontSize: '16px' }}
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
            )}
          </div>
        </div>
        </div>
      </main>

      {/* Footer - appears when NOT expanded */}
      {footerContent && (
        <footer className="px-4 pb-6 pt-3 bg-[#f5f5f0] relative z-20">
          <div className="max-w-md mx-auto w-full flex justify-center">
            {footerContent}
          </div>
        </footer>
      )}

      {/* Floating Continue Button - appears when custom field is expanded AND something is selected */}
      {isExpanded && (selectedOptions.length > 0 || customValue.trim()) && (
        <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-6 pt-2 bg-[#f5f5f0] animate-slide-up" id="continue-button-container">
          <div className="max-w-sm mx-auto w-full">
            <button
              onClick={handleContinue}
              onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
              ref={continueBtnRef}
              className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 sm:px-16 md:px-20 rounded-xl transition-all duration-300 select-none bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
