'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const CURRENT_STEP = 31;
const TOTAL_STEPS = 32;

// Graph helpers from TimePage
const getTforX = (targetX: number, p0x: number, p1x: number, p2x: number) => {
  const a = p0x - 2 * p1x + p2x;
  const b = 2 * (p1x - p0x);
  const c = p0x - targetX;

  if (Math.abs(a) < 1e-6) return -c / b;

  const sqrtVal = Math.sqrt(Math.pow(b, 2) - 4 * a * c);
  const t1 = (-b + sqrtVal) / (2 * a);
  const t2 = (-b - sqrtVal) / (2 * a);

  if (t1 >= 0 && t1 <= 1) return t1;
  return t2;
};

const getBezierY = (t: number, p0y: number, p1y: number, p2y: number) => {
  return Math.pow(1-t, 2) * p0y + 2 * (1-t) * t * p1y + Math.pow(t, 2) * p2y;
};

export default function PersonalizingPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'insights' | 'companion'>('loading');
  
  // Companion page state
  const [companionType, setCompanionType] = useState<'3d' | 'chat'>('chat');
  const [isMuted, setIsMuted] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Typing animation state
  const [displayedText, setDisplayedText] = useState('');
  const [hasTypingAnimationPlayed, setHasTypingAnimationPlayed] = useState(false);
  const fullChatText = `Nightmares stealing your rest? You're doing your best even when sleep feels unsafe.

Like rebooting a phone, a 30-second "4-7-8" breath can reset your nervous system: inhale 4, hold 7, exhale 8.

Thousands sleep deeper within a week using our nightmare-soothe stories. Tap below to find your calm inside the app.

Nightmares stealing your rest? You're doing your best even when sleep feels unsafe.

Like rebooting a phone, a 30-second "4-7-8" breath can reset your nervous system: inhale 4, hold 7, exhale 8.

Thousands sleep deeper within a week using our nightmare-soothe stories. Tap below to find your calm inside the app.`;
  
  // Device detection
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
      setIsDesktop(width >= 1024);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  // User data
  const [avatar, setAvatar] = useState('girl');
  const [timeCommitment, setTimeCommitment] = useState(15);
  const [userName, setUserName] = useState('');
  const [mainGoal, setMainGoal] = useState('Emotional balance');
  const [focusGoal, setFocusGoal] = useState('Daily calm & reflection');

  // UI State
  const [showReview, setShowReview] = useState(false);
  const [activeReviewImage, setActiveReviewImage] = useState('/processing-review-1.png');
  const [showFinalContent, setShowFinalContent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeModalId, setActiveModalId] = useState<number | null>(null);

  const [showAlreadyProcessedModal, setShowAlreadyProcessedModal] = useState(false);

  // Progress State
  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const [progress3, setProgress3] = useState(0);
  const [activeBar, setActiveBar] = useState(1);
  const [progressStarted, setProgressStarted] = useState(false);
  
  const shownModalsRef = useRef<number[]>([]);
  const progress1Ref = useRef(0);
  const progress2Ref = useRef(0);
  const progress3Ref = useRef(0);

  // Load data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAvatar = localStorage.getItem('avatarPreference');
      if (savedAvatar) setAvatar(savedAvatar);

      const savedTime = localStorage.getItem('timeCommitment');
      if (savedTime) setTimeCommitment(parseInt(savedTime));

      const savedName = localStorage.getItem('userName');
      if (savedName) setUserName(savedName);

      // Check for previous completion
      const lastParams = localStorage.getItem('lastPersonalizationParams');
      const currentParams = JSON.stringify({
        avatar: savedAvatar || 'girl',
        time: savedTime || '15'
      });
      
      if (lastParams === currentParams) {
        setProgress1(100);
        setProgress2(100);
        setProgress3(100);
        setPhase('ready'); // Skip loading
        setShowAlreadyProcessedModal(true);
      } else {
        // Reset all progress states if params changed
        setProgress1(0);
        setProgress2(0);
        setProgress3(0);
        setProgressStarted(false);
        progress1Ref.current = 0;
        progress2Ref.current = 0;
        progress3Ref.current = 0;
        shownModalsRef.current = [];
        setActiveBar(1);
        setPhase('loading');
        setShowFinalContent(false);
        setShowReview(false);
    }

      const savedMainGoal = localStorage.getItem('mainGoal');
      if (savedMainGoal) {
        try {
          const parsed = JSON.parse(savedMainGoal);
          const labels: Record<string, string> = {
            'stress': 'Reduce daily stress',
            'emotion': 'Feel emotionally stable',
            'relationships': 'Improve relationships',
            'productivity': 'Boost productivity',
            'trauma': 'Heal from past trauma',
            'sleep': 'Sleep better',
            'understanding': 'Understand myself better',
            'support': 'Find support',
            'wellness': 'Feel better overall',
          };
          setMainGoal(parsed.type === 'custom' ? capitalizeFirst(parsed.value) : (labels[parsed.type] || parsed.value));
        } catch {
           setMainGoal(savedMainGoal);
        }
      }

      const savedGoals = localStorage.getItem('goals');
      if (savedGoals) {
        try {
          const goalsData = JSON.parse(savedGoals);
          const items: string[] = [];
          if (goalsData.custom?.trim()) items.push(goalsData.custom.trim());
          if (goalsData.selected?.length) items.push(...goalsData.selected);
          if (items.length) setFocusGoal(items.map((item, i) => i === 0 ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase()).join(', '));
        } catch {}
      }
    }
  }, []);

  const capitalizeFirst = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

  // Companion handlers
  const handleReplay = () => {
    setRotationDegrees(prev => prev - 360);
    setIsMuted(false); // Unmute when replaying
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

  const handleCompanionContinue = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('companionType', companionType);
    }
    router.push('/quiz/paywall');
  };

  const companionAvatarImage = avatar === 'girl' 
    ? '/ai-companion-girl.png' 
    : '/ai-companion-boy.png';

  // Capitalize first letter of userName
  const capitalizedUserName = userName ? userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase() : '';

  // Responsive Animation
  const [slideUpY, setSlideUpY] = useState('-22vh');
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // Mobile - slide up to reduce gap without leaving blank space
        setSlideUpY('-44vh');
      } else if (width < 1024) {
        // Tablet - no slide up
        setSlideUpY('0');
      } else {
        // Desktop
        setSlideUpY('-380px');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Start progress after 0.5s delay
  useEffect(() => {
    if (phase === 'loading' && !progressStarted) {
      const timer = setTimeout(() => {
        setProgressStarted(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [phase, progressStarted]);

  // Initial review timer
  useEffect(() => {
    if (phase === 'loading' && activeBar === 1 && !showReview && progressStarted) {
      const timer = setTimeout(() => {
        setActiveReviewImage('/processing-review-1.png');
        setShowReview(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, activeBar, progressStarted]);

  // Progress Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === 'loading' && !showModal && progressStarted) {
      const updateProgress = () => {
        const currentBar = activeBar;
        const ref = currentBar === 1 ? progress1Ref : currentBar === 2 ? progress2Ref : progress3Ref;
        const setProg = currentBar === 1 ? setProgress1 : currentBar === 2 ? setProgress2 : setProgress3;
        
        const increment = Math.random() * 3 + 0.5;
        const newProgress = Math.min(ref.current + increment, 100);
        ref.current = newProgress;
        setProg(newProgress);

        // Modals
        if (newProgress >= 30 && newProgress <= 47 && !shownModalsRef.current.includes(currentBar)) {
          setShowModal(true);
          setActiveModalId(currentBar);
          shownModalsRef.current.push(currentBar);
    }

        // Reviews for bars 2 and 3 (Bar 1 handled by timeout)
        if (currentBar > 1 && newProgress > 15 && !showReview && !showFinalContent) {
           const img = currentBar === 2 ? '/processing-review-4.png' : 
                       '/processing-review-3.png';
           if (activeReviewImage !== img) {
             setActiveReviewImage(img);
             setShowReview(true);
           }
        }

        if (newProgress >= 100) {
          if (currentBar < 3) {
            setActiveBar(currentBar + 1);
            setShowReview(false);
          } else {
            setPhase('ready');
            setShowReview(false);
            
            // Save completion params
            if (typeof window !== 'undefined') {
               const params = JSON.stringify({
                 avatar: localStorage.getItem('avatarPreference') || 'girl',
                 time: localStorage.getItem('timeCommitment') || '15'
               });
               localStorage.setItem('lastPersonalizationParams', params);
            }
          }
        }
      };
      
      const timeout = Math.random() * 75 + 37;
      interval = setInterval(updateProgress, timeout);
    }
    return () => clearInterval(interval);
  }, [phase, activeBar, showModal, showReview, showFinalContent, activeReviewImage]);

  // Final Content Reveal
  useEffect(() => {
    if (phase === 'ready') setTimeout(() => setShowFinalContent(true), 500);
  }, [phase]);

  // Typing animation effect
  useEffect(() => {
    if (companionType === 'chat' && !hasTypingAnimationPlayed) {
      setDisplayedText('');
      let currentIndex = 0;
      const typingSpeed = 8; // ms per character (fast typing)
      
      const typeNextChar = () => {
        if (currentIndex < fullChatText.length) {
          setDisplayedText(fullChatText.slice(0, currentIndex + 1));
          currentIndex++;
          setTimeout(typeNextChar, typingSpeed);
        } else {
          setHasTypingAnimationPlayed(true);
        }
      };
      
      // Small delay before starting
      setTimeout(typeNextChar, 200);
    }
  }, [companionType, hasTypingAnimationPlayed, fullChatText]);

  const avatarImage = avatar === 'girl' ? '/personalizing-avocado-girl.png' : '/personalizing-avocado-boy.png';
  const hoursPerMonth = parseFloat((timeCommitment * 30 / 60).toFixed(1).replace(/\.0$/, ''));

  // Graph Logic - Exact copy from TimePage
  const width = 300;
  const height = 150;
  const startPoint = { x: 0, y: 142 }; // Today at the bottom
  
  const curveData = useMemo(() => {
    const todayY = startPoint.y; // 142
    const minY = 10; // Top boundary
    const maxRange = todayY - minY; // Available vertical space (132px)
    
    // Fixed proportional values for each timeframe that fit within bounds
    const getPositions = (time: number) => {
      switch (time) {
        case 5:  return { midRatio: 0.12, endRatio: 0.22 };
        case 10: return { midRatio: 0.18, endRatio: 0.32 };
        case 15: return { midRatio: 0.25, endRatio: 0.42 };
        case 30: return { midRatio: 0.38, endRatio: 0.58 };
        case 40: return { midRatio: 0.48, endRatio: 0.72 };
        case 60: return { midRatio: 0.60, endRatio: 0.92 };
        default: return { midRatio: 0.25, endRatio: 0.42 };
      }
    };
    
    const { midRatio, endRatio } = getPositions(timeCommitment);
    
    const midY = todayY - (maxRange * midRatio);
    const endY = todayY - (maxRange * endRatio);
    
    const endPoint = { x: width, y: endY };
    const midPoint = { x: width * 0.5, y: midY };

    // Calculate control point so curve passes through midPoint at t=0.5
    const controlPoint = { 
      x: 2 * midPoint.x - 0.5 * startPoint.x - 0.5 * endPoint.x,
      y: 2 * midPoint.y - 0.5 * startPoint.y - 0.5 * endPoint.y
    };

    const pathD = `M ${startPoint.x} ${startPoint.y} Q ${controlPoint.x} ${controlPoint.y} ${endPoint.x} ${endPoint.y}`;
    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

    return { pathD, areaD, p0: startPoint, p1: controlPoint, p2: endPoint, midPoint };
  }, [timeCommitment]);

  // Fixed marker points matching TimePage
  const graphPoints = [
    { x: width * 0.02, y: startPoint.y },           // Today - at start
    { x: width * 0.5, y: curveData.midPoint.y },    // In 2 weeks - exactly on curve
    { x: width * 0.97, y: curveData.p2.y }          // In 1 month - at end
  ];

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
      className={`min-h-screen bg-[#f5f5f0] flex flex-col overflow-hidden ${phase === 'insights' ? 'fixed inset-0' : ''}`}
      style={{ 
        overscrollBehaviorY: 'auto',
        WebkitOverflowScrolling: 'touch',
        position: 'relative'
      }}
    >
      {/* Fixed Header with Logo - Exact match to QuizLayout */}
      <header className="fixed top-0 left-0 right-0 pt-4 pb-2 px-4 flex items-center justify-center bg-[#f5f5f0] z-50 safe-area-top">
        <div className="flex flex-col items-center">
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
          {phase !== 'insights' && phase !== 'companion' && (
            <div className="w-32 sm:w-40 h-1.5 bg-gray-200 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-[#6B9D47] transition-all duration-500 ease-out rounded-full"
                style={{ width: '100%' }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className={`flex-1 relative overflow-x-hidden pt-16 sm:pt-20 ${phase === 'insights' ? 'overflow-y-auto' : 'overflow-y-auto'}`}>
        
        {/* Loading Phase Content - DESKTOP VERSION */}
        {isDesktop && (
          <motion.div
            className="px-4"
            initial={{ height: 'auto', opacity: 1 }}
            animate={{ 
              height: phase === 'insights' || phase === 'companion' ? 0 : 'auto',
              opacity: phase === 'insights' || phase === 'companion' ? 0 : 1
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="max-w-md mx-auto pt-[60px] pb-8 flex flex-col items-center justify-start min-h-[40vh]">
              <h1 className="text-3xl font-bold text-[#1a1a1a] text-center mb-2">Personalizing your experience...</h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 text-center mb-8 leading-relaxed">Avocado is analyzing your responses to tailor recommendations just for you!</p>

              <div className="w-full space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-medium">
                        {i === 1 ? 'Checking your needs...' : i === 2 ? 'Understanding your goals...' : 'Finalizing your personalized plan...'}
                </span>
                      <span className="text-[#6B9D47] font-bold">
                        {Math.round(i === 1 ? progress1 : i === 2 ? progress2 : progress3)}%
                </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-[#6B9D47]" 
                        style={{ width: `${i === 1 ? progress1 : i === 2 ? progress2 : progress3}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading Phase Content - MOBILE VERSION (same as desktop) */}
        {isMobile && (
          <motion.div
            className="px-4"
            initial={{ height: 'auto', opacity: 1 }}
            animate={{ 
              height: phase === 'insights' || phase === 'companion' ? 0 : 'auto',
              opacity: phase === 'insights' || phase === 'companion' ? 0 : 1
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="max-w-md mx-auto pt-[60px] pb-8 flex flex-col items-center justify-start min-h-[40vh]">
              <h1 className="text-3xl font-bold text-[#1a1a1a] text-center mb-2">Personalizing your experience...</h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 text-center mb-8 leading-relaxed">Avocado is analyzing your responses to tailor recommendations just for you!</p>

              <div className="w-full space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-medium">
                        {i === 1 ? 'Checking your needs...' : i === 2 ? 'Understanding your goals...' : 'Finalizing your personalized plan...'}
                      </span>
                      <span className="text-[#6B9D47] font-bold">
                        {Math.round(i === 1 ? progress1 : i === 2 ? progress2 : progress3)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-[#6B9D47]" 
                        style={{ width: `${i === 1 ? progress1 : i === 2 ? progress2 : progress3}%` }} 
                />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading Phase Content - TABLET VERSION */}
        {isTablet && (
          <AnimatePresence>
            {phase !== 'insights' && phase !== 'companion' && (
              <motion.div
                className="px-4"
                initial={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div className="max-w-md mx-auto pt-[60px] pb-8 flex flex-col items-center justify-start min-h-[40vh]">
                  <h1 className="text-3xl font-bold text-[#1a1a1a] text-center mb-2">Personalizing your experience...</h1>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 text-center mb-8 leading-relaxed">Avocado is analyzing your responses to tailor recommendations just for you!</p>

                  <div className="w-full space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                          <span className="text-gray-800 font-medium">
                            {i === 1 ? 'Checking your needs...' : i === 2 ? 'Understanding your goals...' : 'Finalizing your personalized plan...'}
                </span>
                          <span className="text-[#6B9D47] font-bold">
                            {Math.round(i === 1 ? progress1 : i === 2 ? progress2 : progress3)}%
                </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-[#6B9D47]" 
                            style={{ width: `${i === 1 ? progress1 : i === 2 ? progress2 : progress3}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Card Container - Moves Up */}
        <motion.div
          className="px-4 mt-4"
          animate={{ 
            y: phase === 'companion' ? '-100vh' : 0,
            opacity: phase === 'companion' ? 0 : 1
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {!showFinalContent ? (
                showReview && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center"
                  >
                    <div className="inline-block border-2 border-[#6B9D47] rounded-2xl overflow-hidden bg-white shadow-sm">
                      <Image 
                        src={activeReviewImage} 
                        alt="User Review" 
                        width={400} 
                        height={200} 
                        className="w-full h-auto" 
                        priority 
                      />
                    </div>
                  </motion.div>
                )
              ) : (
                <motion.div
                  key="final"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className={`relative ${phase === 'insights' ? 'mt-[30px]' : 'mt-4'}`}
                >
                  <div className="relative bg-[#EAF4E2] rounded-2xl min-[400px]:rounded-3xl border border-[#d4e5c9] py-4 min-[400px]:py-6 pl-4 min-[400px]:pl-6 pr-[40%] min-[400px]:pr-[45%]" style={{ clipPath: 'inset(-100% 0 0 round 16px)' }}>
                    <h3 className="text-base min-[400px]:text-lg sm:text-xl font-bold text-[#1a1a1a] leading-relaxed min-[400px]:leading-loose tracking-wide break-words">
                      {capitalizedUserName ? (
                        <>
                          <span className="text-[#6B9D47] whitespace-nowrap">{capitalizedUserName.length > 15 ? capitalizedUserName.slice(0, 15) + '...' : capitalizedUserName}</span><span className="text-[#1a1a1a]">,</span>
                          {capitalizedUserName.length > 10 && <br />}
                          <span className="break-normal">{capitalizedUserName.length <= 10 ? ' ' : ''}your personal mental health insights are ready!</span>
                        </>
                      ) : 'Your personal mental health insights are ready!'}
                    </h3>
                    <div className="absolute right-0 bottom-0 w-[60%] min-[400px]:w-[60%] sm:w-[62%] md:w-[60%] h-[206%] min-[400px]:h-[211%] sm:h-[216%] md:h-[229%] pointer-events-none">
                      <Image src={avatarImage} alt="Personalized Avocado" fill className="object-contain object-right-bottom" priority />
                    </div>
                  </div>

                  {/* Insights Panel - Nested for Gap Fix */}
                  {phase === 'insights' && (
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                    >
                      <div className="pb-6 sm:pb-8">
                         <div className="bg-[#EAF4E2] rounded-3xl p-4 sm:p-6 mb-2 space-y-3 sm:space-y-4 shadow-sm">
                           {/* Duration */}
                           <div className="flex items-center gap-3">
                             <div className="w-9 h-9 flex items-center justify-center">
                               <Image src="/icon-duration.png" alt="Duration" width={32} height={32} className="w-8 h-8 object-contain" />
                             </div>
                             <div>
                               <p className="text-xs text-gray-500 font-medium">Duration:</p>
                               <p className="text-lg font-medium text-[#1a1a1a]">{timeCommitment} minutes a day</p>
              </div>
            </div>

                           {/* Goal */}
                           <div className="flex items-center gap-3">
                             <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
                               <Image src="/icon-goal.png" alt="Goal" width={32} height={32} className="w-8 h-8 object-contain" />
                             </div>
                             <div className="min-w-0 flex-1 overflow-hidden">
                               <p className="text-xs text-gray-500 font-medium">Goal:</p>
                               <div className="overflow-x-auto scrollbar-thin pb-2">
                                 <p className="text-lg font-medium text-[#1a1a1a] leading-tight whitespace-nowrap pr-4">{mainGoal ? mainGoal.charAt(0).toUpperCase() + mainGoal.slice(1).toLowerCase() : mainGoal}</p>
              </div>
              </div>
            </div>

                           {/* Focus */}
                           <div className="flex items-center gap-3">
                             <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
                               <Image src="/icon-focus.png" alt="Focus" width={32} height={32} className="w-8 h-8 object-contain" />
              </div>
                             <div className="min-w-0 flex-1 overflow-hidden">
                               <p className="text-xs text-gray-500 font-medium">We'll start by working on:</p>
                               <div className="overflow-x-auto scrollbar-thin pb-2">
                                 <p className="text-lg font-medium text-[#1a1a1a] leading-tight whitespace-nowrap pr-4">{focusGoal}</p>
              </div>
            </div>
          </div>
        </div>

                         <p className="text-gray-700 text-center text-lg font-medium mb-2 lg:mb-6 mt-4">
                           {hoursPerMonth} hours per month — just {timeCommitment} min a day
                         </p>

                         {/* Graph - Exact copy from TimePage */}
                         <div className="relative w-full h-48 sm:h-64 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6 lg:mb-4">
                           <div className="absolute bottom-2 left-4 text-xs font-medium text-gray-500">Today</div>
                           <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500">In 2 weeks</div>
                           <div className="absolute bottom-2 right-4 text-xs font-medium text-gray-500">In 1 month</div>
                           
                           <div className="absolute inset-0 p-4 pb-6">
                             <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                               <path d={curveData.areaD} fill="#C8E6C9" fillOpacity="0.6" />
                               {/* Guide lines */}
                               {[20, 40].map((offset, i) => {
                                 const guideP0 = { ...curveData.p0, y: curveData.p0.y - offset };
                                 const guideP1 = { ...curveData.p1, y: curveData.p1.y - offset };
                                 const guideP2 = { ...curveData.p2, y: curveData.p2.y - offset };
                                 const guideD = `M ${guideP0.x} ${guideP0.y} Q ${guideP1.x} ${guideP1.y} ${guideP2.x} ${guideP2.y}`;
                                 return <path key={i} d={guideD} fill="none" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />;
                               })}
                               <path d={curveData.pathD} fill="none" stroke="#6B9D47" strokeWidth="3" strokeLinecap="round" strokeDasharray="12 12" />
                               {graphPoints.map((p, i) => (
                                 <circle key={i} cx={p.x} cy={p.y} r={i === 2 ? 8 : 5} fill="white" stroke="#6B9D47" strokeWidth="3" />
                               ))}
                             </svg>
                           </div>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer Button - Insights Phase */}
        {((showFinalContent && phase === 'ready') || phase === 'insights') && (
           <div
               className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#f5f5f0] via-[#f5f5f0] to-transparent pt-8 z-20"
             style={{ opacity: 1, transform: 'translateY(0)' }}
             >
               <div className="max-w-md mx-auto">
                 <button
                   onClick={() => {
                     if (phase === 'ready') {
                       setPhase('insights');
                     } else {
                       setPhase('companion');
                     }
                   }}
                   onTouchEnd={(e) => { 
                     e.preventDefault(); 
                     if (phase === 'ready') {
                       setPhase('insights');
                     } else {
                       setPhase('companion');
                     }
                   }}
                 className="w-full font-semibold text-xl py-3 rounded-xl transition-all duration-300 bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer select-none"
                 >
                   {phase === 'ready' ? "Let's see your results" : "Continue"}
                 </button>
               </div>
           </div>
        )}

        {/* Companion Phase Content */}
        <AnimatePresence>
          {phase === 'companion' && (
            <motion.div
              className="absolute inset-0 top-[70px] sm:top-[80px] flex flex-col bg-[#f5f5f0] z-10"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {/* MOBILE/TABLET: Grid layout */}
              {!isDesktop && (
                <div className="flex-1 flex flex-col items-center px-4 pb-24 min-h-0">
                  {/* Title - fixed height */}
                  <div className="text-center pb-2 -mt-3 flex-shrink-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2">
                      Your personalized insights are ready!
                    </h1>
                    <p className="text-gray-500 text-base sm:text-lg">
                      Avocado AI Assistant
                    </p>
                  </div>

                  {/* Main Content - flexible, can shrink */}
                  <div className="relative w-full max-w-[500px] sm:max-w-[450px] flex-1 min-h-0 mb-10">
                    {/* Avocado icon for chat */}
                    <div className="absolute bottom-6 left-[-17px] sm:left-[-27px] w-14 h-14 rounded-full flex items-center justify-center z-30"
                      style={{ display: companionType === 'chat' ? 'flex' : 'none' }}
                    >
                      <Image
                        src="/avocado-chat-logo.png"
                        alt="Avocado"
                        width={56}
                        height={56}
                        className="object-contain"
                      />
                    </div>

                    {/* Carousel Container */}
                    <div className="relative w-full h-full overflow-hidden">

                      {/* Chat View */}
                      <motion.div 
                        className="absolute inset-0 overflow-visible"
                        initial={{ x: 0 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                      >
                        <div className="h-full flex flex-col p-4">
                          <div className="relative flex-1 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(to bottom, #f9f3c8 0%, #e3f0d5 100%)' }}>
                            <div className="text-gray-800 text-sm leading-relaxed space-y-4 overflow-y-auto h-full p-6 pb-20">
                              {(hasTypingAnimationPlayed ? fullChatText : displayedText).split('\n\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                              ))}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(227, 240, 213, 0.9) 50%, #e3f0d5 100%)' }}></div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                </div>
              )}

              {/* DESKTOP: Original layout with side button */}
              {isDesktop && (
                <div className="flex-1 flex flex-col items-center px-4 pb-28">
                  {/* Title */}
                  <div className="text-center pb-2 -mt-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2">
                      Your personalized insights are ready!
                    </h1>
                    <p className="text-gray-500 text-base sm:text-lg">
                      Avocado AI Assistant
                    </p>
                  </div>

                  {/* Container with Chat Button and Carousel */}
                  <div className="relative w-full max-w-[450px]">

                    {/* Avocado icon - DESKTOP */}
                    <div className="absolute bottom-0 left-[-45px] w-14 h-14 rounded-full flex items-center justify-center z-30"
                      style={{ display: companionType === 'chat' ? 'flex' : 'none' }}
                    >
                      <Image
                        src="/avocado-chat-logo.png"
                        alt="Avocado"
                        width={56}
                        height={56}
                        className="object-contain"
                      />
                    </div>

                    {/* Carousel Container - Avatar Image and Chat */}
                  <div className="relative w-full aspect-[2/3] overflow-hidden">

                    {/* Chat View - DESKTOP */}
                    <motion.div 
                      className="absolute inset-0 overflow-visible"
                      initial={{ x: 0 }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                      <div className="h-full flex flex-col p-4">
                        <div className="relative flex-1 rounded-3xl overflow-hidden"
                          style={{ background: 'linear-gradient(to bottom, #f9f3c8 0%, #e3f0d5 100%)' }}
                        >
                          <div className="text-gray-800 text-base leading-relaxed space-y-4 overflow-y-auto h-full p-6 pb-20">
                            {(hasTypingAnimationPlayed ? fullChatText : displayedText).split('\n\n').map((paragraph, index) => (
                              <p key={index}>{paragraph}</p>
                            ))}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                            style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(227, 240, 213, 0.9) 50%, #e3f0d5 100%)' }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              )}

              {/* Companion Footer Button */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#f5f5f0] via-[#f5f5f0] to-transparent pt-8">
                <div className="max-w-md mx-auto">
          <button
                    onClick={handleCompanionContinue}
                    onTouchEnd={(e) => { e.preventDefault(); handleCompanionContinue(); }}
                    className="w-full font-semibold text-lg sm:text-xl py-4 rounded-xl transition-all duration-300 bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer select-none"
          >
                    Continue my journey
          </button>
        </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <AnimatePresence>
          {showAlreadyProcessedModal && (
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
                 <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 text-center">Your personal plan is ready.</h3>
                 <p className="text-gray-600 mb-6 text-justify leading-relaxed">
                   We’ve already processed your answers and calculated your progress indicators.
                   You can continue right where you left off — no need to repeat anything.
                 </p>
                 <button 
                   onClick={() => {
                     setShowAlreadyProcessedModal(false);
                     // Allow user to proceed to insights
                     setTimeout(() => setPhase('insights'), 100);
                   }}
                   onTouchEnd={(e) => { e.preventDefault(); setShowAlreadyProcessedModal(false); setTimeout(() => setPhase('insights'), 100); }}
                   className="w-full py-3 rounded-xl bg-[#6B9D47] text-white font-semibold hover:bg-[#5d8a3d] transition-all hover:scale-105 active:scale-95 shadow-md select-none"
                 >
                   Continue
                 </button>
               </motion.div>
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
               <motion.div
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-sm mx-auto shadow-xl border-2 border-[#6B9D47]"
               >
                 <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                   {activeModalId === 1 ? 'To personalize your plan' : activeModalId === 2 ? 'One more thing' : 'Before we continue'}
                 </p>
                 <h3 className="text-xl font-bold text-[#1a1a1a] mb-6">
                   {activeModalId === 1 ? 'Is it important for you to recharge after busy days?' : activeModalId === 2 ? 'Do you check in with your feelings during the day?' : 'Do small routines help you feel calmer?'}
                 </h3>
                 <div className="flex gap-3">
                   <button onClick={() => setShowModal(false)} onTouchEnd={(e) => { e.preventDefault(); setShowModal(false); }} className="flex-1 py-3 rounded-xl border-2 border-[#6B9D47] text-[#6B9D47] font-semibold hover:bg-[#f0fdf4] transition-all hover:scale-105 active:scale-95 select-none">No</button>
                   <button onClick={() => setShowModal(false)} onTouchEnd={(e) => { e.preventDefault(); setShowModal(false); }} className="flex-1 py-3 rounded-xl bg-[#6B9D47] text-white font-semibold hover:bg-[#5d8a3d] transition-all hover:scale-105 active:scale-95 shadow-md select-none">Yes</button>
                 </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}