'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import Modal from '../../components/Modal';

export default function PaywallPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'weekly'>('annual');
  const [avatar, setAvatar] = useState('boy');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // User data from quiz
  const [userFeelings, setUserFeelings] = useState<string[]>([]);
  const [mainGoal, setMainGoal] = useState<string>('');
  const [weeklyGoals, setWeeklyGoals] = useState<string[]>([]);
  const [timeCommitment, setTimeCommitment] = useState<number>(0);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('avatarPreference');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
    
    // Load user feelings
    const feelings = localStorage.getItem('userFeelings');
    if (feelings) {
      setUserFeelings(JSON.parse(feelings));
    }
    
    // Load main goal
    const goal = localStorage.getItem('mainGoal');
    if (goal) {
      const parsed = JSON.parse(goal);
      const goalLabels: Record<string, string> = {
        'stress': 'Reduce daily stress',
        'emotion': 'Feel emotionally stable',
        'sleep': 'Sleep better',
        'relationships': 'Improve relationships',
        'wellness': 'Feel better overall'
      };
      setMainGoal(parsed.type === 'custom' ? parsed.value : (goalLabels[parsed.type] || parsed.value));
    }
    
    // Load weekly goals
    const goals = localStorage.getItem('goals');
    if (goals) {
      const parsed = JSON.parse(goals);
      const allGoals = [...(parsed.selected || [])];
      if (parsed.custom) allGoals.push(parsed.custom);
      setWeeklyGoals(allGoals);
    }
    
    // Load time commitment
    const time = localStorage.getItem('timeCommitment');
    if (time) {
      setTimeCommitment(parseInt(time));
    }
  }, []);

  const handleContinue = () => {
    // Navigate to next step (checkout or similar)
    // For now, just log or maybe go to a success page?
    console.log('Selected plan:', selectedPlan);
    // router.push('/quiz/checkout'); 
  };

  const beforeItems = [
    ['Feelings of', 'anxiety and stress'],
    ['Mood', 'swings'],
    ['Struggles with', 'self-esteem']
  ];

  const afterItems = [
    ['Inner peace and', 'confidence'],
    ['Stable', 'emotional state'],
    ['Self-care and', 'self-love']
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col font-sans animate-fadeIn">
      {/* Header */}
      <header className="relative pt-4 sm:pt-6 pb-2 bg-[#f5f5f0] z-30">
        <div className="flex justify-center items-center">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 pb-[350px]"> {/* Large padding bottom for fixed footer */}
        
        {/* Before / After Section */}
        <div className="w-full max-w-4xl mx-auto mb-8 relative">
          <div className="flex justify-center items-start relative min-h-[280px] sm:min-h-[320px]">
             {/* Left Column - Before */}
             <div className="absolute left-[12%] sm:left-[15%] top-1/2 -translate-y-1/2 w-[25%] sm:w-[22%] flex flex-col gap-5 sm:gap-7 z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">Before</h2>
                {beforeItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-base text-gray-700">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FF4B4B] flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px] sm:text-xs mt-0.5">
                      ✕
                    </div>
                    <span className="leading-tight">
                      {item[0]}<br />{item[1]}
                    </span>
                  </div>
                ))}
             </div>

             {/* Center Image - Overlapping */}
             <div className="w-[50%] sm:w-[45%] max-w-[300px] z-0">
               <div className="relative w-full aspect-square">
                <Image 
                  src={avatar === 'girl' ? "/before-after-avocado-girl.png" : "/before-after-avocado.png"}
                  alt="Before and After Avocado"
                  fill
                  className="object-contain scale-125"
                  priority
                />
               </div>
             </div>

             {/* Right Column - After */}
             <div className="absolute right-[5%] sm:right-[10%] top-1/2 -translate-y-1/2 w-[25%] sm:w-[22%] flex flex-col gap-5 sm:gap-7 z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">After</h2>
                {afterItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-base text-gray-700">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#22C55E] flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px] mt-0.5">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="leading-tight">
                      {item[0]}<br />{item[1]}
                    </span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-lg mx-auto mb-4 mt-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-3 leading-tight px-4">
            Get full access to your personal mental-wellbeing journey with Avocado AI Therapist
          </h1>
          <p className="text-gray-500 text-base sm:text-lg px-4 mt-8">
            200× cheaper than a traditional therapist<br />with everyday check-ins
          </p>
        </div>

        {/* Second Screen - Hero Image */}
        <div className="w-full max-w-2xl mx-auto mt-8 relative">
          <Image
            src="/paywall-hero.png"
            alt="Avocado Team"
            width={800}
            height={800}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        {/* Make Avo your own Section */}
        <div className="w-full max-w-md mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] text-center mb-2 leading-tight">
            Make Avo your own — fully match it to your vibe
          </h2>
          
          <p className="text-gray-400 text-center text-base font-medium mb-6">What's included</p>
          
          <div className="space-y-5">
            {/* Live 3D Avo Companion */}
            <div className="flex items-start gap-3">
              <Image src="/icon-avocado.png" alt="Avocado" width={32} height={32} className="w-8 h-8 object-contain flex-shrink-0" />
              <div>
                <h3 className="font-bold text-[#1a1a1a] text-base">Live 3D Avo Companion</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Customize your Avo's look, voice, music, and space to feel supported and grounded anytime.</p>
              </div>
            </div>
            
            {/* Voice chat with memory */}
            <div className="flex items-start gap-3">
              <Image src="/icon-chat.png" alt="Chat" width={32} height={32} className="w-8 h-8 object-contain flex-shrink-0" />
              <div>
                <h3 className="font-bold text-[#1a1a1a] text-base">Voice chat with memory</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Talk or type — Avocado remembers, adapts, and offers guidance across 9 expert modes.</p>
              </div>
            </div>
            
            {/* Self Care Tools */}
            <div className="flex items-start gap-3">
              <Image src="/icon-heart.png" alt="Heart" width={56} height={56} className="w-14 h-14 object-contain flex-shrink-0 -ml-3 -mt-2 -mr-3" />
              <div>
                <h3 className="font-bold text-[#1a1a1a] text-base">Self Care Tools</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Breathing, meditations, calming sounds, Mood Journal, progress tracking, and affirmations to help you relax and reset.</p>
              </div>
            </div>
            
            {/* Full Privacy */}
            <div className="flex items-start gap-3">
              <Image src="/icon-lock.png" alt="Lock" width={32} height={32} className="w-8 h-8 object-contain flex-shrink-0" />
              <div>
                <h3 className="font-bold text-[#1a1a1a] text-base">Full Privacy</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Your data stays fully private with a dedicated, isolated provider and locked access.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Awards Section */}
        <div className="w-full max-w-md mx-auto px-4 pb-8 overflow-hidden">
          <Image src="/awards.png" alt="Awards" width={400} height={150} className="w-full object-contain -mt-4" />
        </div>

        {/* Transform Section */}
        <div className="w-full max-w-md mx-auto px-4 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] text-center mb-4 leading-tight">
            Transform your life in one week
          </h2>
          
          <div className="flex gap-4">
            {/* Gradient Bar Image */}
            <div className="flex-shrink-0 bg-[#f5f5f0] rounded-full overflow-hidden h-[270px]">
              <Image src="/infographic-bar.png" alt="Progress" width={60} height={300} className="h-72 w-auto object-contain object-top mix-blend-multiply" />
            </div>
            
            {/* Text Content */}
            <div className="flex flex-col justify-between py-2">
              <div>
                <p className="text-gray-400 text-sm mb-0.5">Day 1:</p>
                <h3 className="font-bold text-[#1a1a1a] text-lg mb-1">Start Fresh</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Diagnose and create a long-term therapy plan.</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-0.5">Day 3:</p>
                <h3 className="font-bold text-[#1a1a1a] text-lg mb-1">Stay Grounded</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Control your progress and adjust therapy</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-0.5">Day 7:</p>
                <h3 className="font-bold text-[#1a1a1a] text-lg mb-1">Thrive!</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Find balance and make first achievements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Goals Section */}
        <div className="w-full max-w-md mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] text-center mb-6 leading-tight">
            Our goals
          </h2>
          
          <div className="space-y-4">
            {/* Goal 1: Help you get rid of... */}
            {userFeelings.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#6B9D47] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 text-base leading-relaxed">
                  Help you get rid of {userFeelings.join(', ').toLowerCase()}
                </p>
              </div>
            )}
            
            {/* Goal 2: Achieve your main goal... */}
            {mainGoal && (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#6B9D47] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 text-base leading-relaxed">
                  Achieve your main goal — {mainGoal.toLowerCase()}
                </p>
              </div>
            )}
            
            {/* Goal 3: We'll focus on... */}
            {weeklyGoals.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#6B9D47] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 text-base leading-relaxed">
                  We'll focus on {weeklyGoals.join(', ').toLowerCase()}
                </p>
              </div>
            )}
            
            {/* Goal 4: Recommended daily time... */}
            {timeCommitment > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#6B9D47] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 text-base leading-relaxed">
                  Recommended daily time — {timeCommitment} minutes
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Cloud Section */}
        <div className="w-full max-w-2xl mx-auto my-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] text-center mb-6 leading-tight px-4">
            Join the new era of psychotherapy
          </h2>
          <Image
            src="/reviews-cloud.png"
            alt="Customer Reviews"
            width={800}
            height={600}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Evidence-Based Section */}
        <div className="w-full max-w-md mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] text-center mb-3 leading-tight">
            Built on evidence-based mental health methods
          </h2>
          <p className="text-gray-500 text-base text-center mb-8">
            Your Avocado plan is grounded in clinically tested psychology and years of research.
          </p>
          
          <div className="space-y-4">
            {/* Harvard */}
            <div className="bg-white rounded-2xl py-5 px-6 border-2 border-[#6B9D47]">
              <p className="text-center">
                <span className="block text-[#1a1a1a] text-2xl font-serif font-bold tracking-wide">HARVARD</span>
                <span className="block text-gray-400 text-sm tracking-widest">UNIVERSITY</span>
              </p>
            </div>
            
            {/* Oxford */}
            <div className="bg-white rounded-2xl py-5 px-6 border-2 border-[#6B9D47]">
              <p className="text-center">
                <span className="block text-gray-400 text-xs tracking-widest mb-1">UNIVERSITY OF</span>
                <span className="block text-[#1a1a1a] text-2xl font-serif font-bold tracking-wide">OXFORD</span>
              </p>
            </div>
            
            {/* Cambridge */}
            <div className="bg-white rounded-2xl py-5 px-6 border-2 border-[#6B9D47]">
              <p className="text-center">
                <span className="block text-gray-400 text-xs tracking-widest mb-1">UNIVERSITY OF</span>
                <span className="block text-[#1a1a1a] text-2xl font-serif font-bold tracking-wide">CAMBRIDGE</span>
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="w-full max-w-md mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] text-center mb-6 leading-tight">
            People often ask
          </h2>
          
          <div className="space-y-6">
            {/* FAQ 1 */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#6B9D47] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">?</span>
              </div>
              <div>
                <h3 className="font-bold text-[#1a1a1a] text-base mb-2">What if I don't have enough willpower to stick with Avocado?</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Avocado is built for low-energy days. You don't have to "push yourself" — the app gives short, doable check-ins, gentle reminders, and tiny habits you can actually keep. Your 3D Avocado keeps you accountable and celebrates every small win so you stay on track without burning out.</p>
              </div>
            </div>
            
            {/* FAQ 2 */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#6B9D47] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">?</span>
              </div>
              <div>
                <h3 className="font-bold text-[#1a1a1a] text-base mb-2">What if my life is too chaotic right now?</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Avocado helps you bring order into the chaos. Together with your Avocado you'll set 1–2 clear priorities, get quick grounding tools for stressful moments, and simple routines you can fit into a busy schedule. No hour-long practices — just bite-sized steps that still move you forward.</p>
              </div>
            </div>
            
            {/* FAQ 3 */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#6B9D47] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">?</span>
              </div>
              <div>
                <h3 className="font-bold text-[#1a1a1a] text-base mb-2">What if I feel overwhelmed and don't know where to start?</h3>
                <p className="text-gray-500 text-sm leading-relaxed">The app starts with a short check-in and then builds a step-by-step plan for you. Avocado explains what to do today, not "in general": one exercise, one reflection, one breathing practice at a time. You always know the next small step instead of trying to fix everything at once.</p>
              </div>
            </div>
            
            {/* FAQ 4 */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#6B9D47] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">?</span>
              </div>
              <div>
                <h3 className="font-bold text-[#1a1a1a] text-base mb-2">What if I've tried other apps and nothing really helped?</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Avocado adapts to you instead of giving the same content to everyone. The AI companion remembers your mood, triggers, and progress, adjusts recommendations, and shows you what actually works for you over days and weeks. You're not just consuming content — you're following a personalized self-care plan that learns from your real life.</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Sticky Footer - Payment Options (Ultra Compact Style) */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 flex justify-center sm:pb-6 pointer-events-none">
        <div className="bg-white w-full sm:max-w-[500px] rounded-t-[32px] sm:rounded-[32px] px-4 pt-4 pb-2 sm:pb-4 shadow-[0_-10px_60px_rgba(0,0,0,0.08)] pointer-events-auto border-t border-gray-100 sm:border-none">
          <div className="max-w-md mx-auto">
          
          <div className="space-y-1.5 mb-2">
            {/* Weekly Plan */}
            <div 
              onClick={() => setSelectedPlan('weekly')}
              className={`relative flex items-center p-2 rounded-xl border-[1.5px] cursor-pointer transition-all ${selectedPlan === 'weekly' ? 'border-[#6B9D47] bg-[#f0f9eb]' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="absolute -top-2.5 right-1/2 translate-x-1/2 bg-[#6B9D47] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                ONE-TIME OFFER
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-2 ${selectedPlan === 'weekly' ? 'border-[#6B9D47]' : 'border-gray-300'}`}>
                {selectedPlan === 'weekly' && <div className="w-2 h-2 rounded-full bg-[#6B9D47]" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center h-8">
                  <span className="font-bold text-[#1a1a1a] text-sm flex items-center gap-1.5">
                    <span className="line-through decoration-gray-400 text-gray-400">Weekly</span>
                    <span className="text-[#1a1a1a] font-bold text-sm">Your Offer</span>
                  </span>
                  <div className="flex flex-col items-end leading-tight">
                    <span className="font-bold text-[#1a1a1a] text-sm">$0.99</span>
                    <span className="text-gray-400 line-through text-xs">$6.99</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-0.5"><span className="text-sm font-semibold">1 week</span> • $6.99</div>
              </div>
            </div>

            {/* Annual Plan */}
            <div 
              onClick={() => setSelectedPlan('annual')}
              className={`flex items-center p-2 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === 'annual' ? 'border-[#6B9D47] bg-[#f0f9eb]' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-2 ${selectedPlan === 'annual' ? 'border-[#6B9D47]' : 'border-gray-300'}`}>
                {selectedPlan === 'annual' && <div className="w-2 h-2 rounded-full bg-[#6B9D47]" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center h-8">
                  <span className="font-bold text-[#1a1a1a] text-sm">Annual</span>
                  <div className="flex flex-col items-end leading-tight">
                    <span className="font-bold text-[#1a1a1a] text-sm">$79.99</span>
                    <span className="text-gray-400 line-through text-xs">$98.99</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-0.5"><span className="text-sm font-semibold">1 year</span> • $1.55/week</div>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-gray-400 mb-2">Cancel anytime</div>

          <button 
            onClick={handleContinue}
            className="w-full py-3 rounded-xl bg-[#6B9D47] text-white font-bold text-base hover:bg-[#5d8a3d] transition-all hover:scale-[1.02] active:scale-95 shadow-md mb-3"
          >
            Continue
          </button>

          {/* Terms, Pay Safe, Privacy - одна строка */}
          <div className="flex justify-center items-center gap-2 text-[9px] text-gray-400 font-medium">
            <button onClick={() => setActiveModal('terms')} className="hover:text-gray-600 transition-colors">Terms of Service</button>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-0.5 text-[#6B9D47]">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[9px] font-semibold">Pay Safe & Secure</span>
            </div>
            <span className="text-gray-300">•</span>
            <button onClick={() => setActiveModal('privacy')} className="hover:text-gray-600 transition-colors">Privacy Policy</button>
          </div>

          {/* Payment Icons */}
          <div className="flex items-center justify-center gap-2 mt-1">
              <Image src="/gpay.png" alt="Google Pay" width={36} height={20} className="h-5 w-auto object-contain" />
              <Image src="/applepay.png" alt="Apple Pay" width={36} height={20} className="h-5 w-auto object-contain" />
              <Image src="/visa.png" alt="Visa" width={36} height={20} className="h-5 w-auto object-contain" />
              <Image src="/mastercard.png" alt="Mastercard" width={36} height={20} className="h-5 w-auto object-contain" />
              <Image src="/discover.png" alt="Discover" width={36} height={20} className="h-5 w-auto object-contain" />
              <Image src="/amex.png" alt="Amex" width={36} height={20} className="h-5 w-auto object-contain" />
          </div>

        </div>
      </div>
      </footer>

      {/* Modals */}
      <Modal
        isOpen={activeModal === 'terms'}
        onClose={() => setActiveModal(null)}
        title="Terms of Use"
      >
        <div className="text-gray-700 space-y-4">
          <p className="font-semibold">Welcome to Avocado!</p>
          <p>These Terms of Use ("Terms," "Agreement") govern your access to and use of the website, quiz, and related services operated by <strong>AvocadoAI LLC</strong> ("Avocado," "we," "us," or "our"). By accessing or using the Avocado website (the "Site") or any of our digital products, you agree to be bound by these Terms and our <strong>Privacy Policy</strong>, which is incorporated herein by reference.</p>
          <p>If you do not agree to these Terms, please do not use the Site or Services.</p>
          
          <h3 className="font-bold text-lg mt-6">1. About Avocado</h3>
          <p>Avocado provides an AI-powered self-care platform designed to help users reflect on their emotional state, track well-being, and receive personalized mental-health insights ("Services").</p>
          <p>Our online quiz and tools generate recommendations and reports based on user responses. These materials are for <strong>informational and educational purposes only</strong> and are not intended to replace medical advice, diagnosis, or treatment.</p>
          
          <h3 className="font-bold text-lg mt-6">2. No Medical Advice</h3>
          <p>You acknowledge and agree that:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Avocado is <strong>not a healthcare provider</strong>, and its Services do not constitute therapy, medical advice, diagnosis, or treatment.</li>
            <li>All content, including AI suggestions, self-assessment results, or follow-up recommendations, is provided <strong>for general informational purposes only</strong>.</li>
            <li>You should always consult a qualified healthcare professional with any questions about a medical or psychological condition.</li>
          </ul>
          <p className="mt-2">If you experience distress, crisis, or emergency, please contact local emergency services or a licensed professional immediately.</p>
          
          <h3 className="font-bold text-lg mt-6">3. Use of the Website and Services</h3>
          <p>You may access and use the Site and Services solely for personal, non-commercial purposes. You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Copy, reproduce, or redistribute any part of the Site or its content;</li>
            <li>Use the Site for unlawful, misleading, or fraudulent purposes;</li>
            <li>Interfere with, damage, or impair the Site's operation or security.</li>
          </ul>
          <p className="mt-2">Avocado reserves the right to suspend or terminate your access if we believe you are misusing the Services or violating these Terms.</p>
          
          <h3 className="font-bold text-lg mt-6">4. Account and Access</h3>
          <p>Certain features of the Site (including saving results, generating reports, or accessing premium content) may require you to create an account or provide your email address.</p>
          <p>You agree to provide accurate information and to maintain the confidentiality of your login credentials. You are responsible for all activities that occur under your account.</p>
          
          <h3 className="font-bold text-lg mt-6">5. Payments and Subscriptions</h3>
          <p>Some Services, including personalized AI reports or ongoing wellness programs, are available on a paid basis ("Paid Services").</p>
          <p>By submitting payment, you authorize Avocado or its payment processor to charge your chosen method for all applicable fees. All prices and payment terms are displayed at the time of purchase and may vary by region.</p>
          <p>Payments are processed securely by third-party providers; Avocado does not store your payment details.</p>
          <p>Subscription renewals, free trial terms, and cancellation rules are governed by our <strong>Subscription Policy</strong>.</p>
          
          <h3 className="font-bold text-lg mt-6">6. Intellectual Property</h3>
          <p>All materials, trademarks, designs, AI models, text, and graphics on the Site are owned by or licensed to AvocadoAI LLC and protected by applicable intellectual property laws.</p>
          <p>You receive a <strong>limited, non-exclusive, non-transferable license</strong> to access and use the Site for personal purposes only.</p>
          <p>You may not modify, resell, or create derivative works based on Avocado content without our express written consent.</p>
          
          <h3 className="font-bold text-lg mt-6">7. Disclaimer of Warranties</h3>
          <p>The Services are provided "as is" and "as available," without warranties of any kind. Avocado makes no representations or guarantees that:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>The Services will be uninterrupted, secure, or error-free;</li>
            <li>Any results or recommendations will be accurate, complete, or suitable for your specific situation.</li>
          </ul>
          <p className="mt-2">You use the Site at your own discretion and risk.</p>
          
          <h3 className="font-bold text-lg mt-6">8. Limitation of Liability</h3>
          <p>To the fullest extent permitted by law, Avocado and its affiliates, officers, employees, or agents shall not be liable for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Any indirect, incidental, or consequential damages arising from your use or inability to use the Site or Services;</li>
            <li>Loss of data, profits, or goodwill;</li>
            <li>Any reliance placed on AI-generated recommendations or quiz results.</li>
          </ul>
          <p className="mt-2">Total liability shall not exceed the amount you paid (if any) for the Services.</p>
          
          <h3 className="font-bold text-lg mt-6">9. User Content</h3>
          <p>If you voluntarily submit text, audio, or video input through the Site, you grant Avocado a worldwide, non-exclusive, royalty-free license to process and analyze that content for the purpose of improving our Services and generating your personalized insights.</p>
          <p>We do not share or publish personal submissions in identifiable form without consent.</p>
          
          <h3 className="font-bold text-lg mt-6">10. Privacy</h3>
          <p>Your privacy and data security are governed by our <strong>Privacy Policy</strong>, available on the Site.</p>
          <p>By using Avocado, you consent to the collection, use, and processing of your data in accordance with that policy.</p>
          
          <h3 className="font-bold text-lg mt-6">11. Termination</h3>
          <p>We may suspend or terminate your access to the Site at any time if you violate these Terms or use the Services in a manner that may cause harm to Avocado or others.</p>
          <p>Upon termination, all rights granted to you shall immediately cease.</p>
          
          <h3 className="font-bold text-lg mt-6">12. Binding Arbitration and Class Action Waiver (U.S. Users)</h3>
          <p>If you are located in the United States, any dispute arising from or related to these Terms or the Services shall be resolved through <strong>binding arbitration</strong> rather than court.</p>
          <p>You and Avocado agree to waive the right to participate in class actions or jury trials.</p>
          <p>Full arbitration details are available upon written request.</p>
          
          <h3 className="font-bold text-lg mt-6">13. Changes to These Terms</h3>
          <p>We may update or modify these Terms from time to time. Updated versions will be posted on this page with a revised "Last Updated" reference.</p>
          <p>Your continued use of the Site after any modification constitutes your acceptance of the updated Terms.</p>
          
          <h3 className="font-bold text-lg mt-6">14. Contact</h3>
          <p>For questions regarding these Terms or the Services, please contact: <a href="mailto:support@youravocado.app" className="text-blue-600 hover:underline">support@youravocado.app</a></p>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'privacy'}
        onClose={() => setActiveModal(null)}
        title="Privacy Policy"
      >
        <div className="text-gray-700 space-y-4">
          <p>We at AvocadoAI LLC ("Avocado," "we," "us," or "our") have created this privacy policy (this "Privacy Policy") because we know that you care about how information you provide to us is used and shared. This Privacy Policy relates to the information collection and use practices of Avocado in connection with our App.</p>
          
          <p>By clicking "I AGREE," or otherwise manifesting your asset to the Privacy Policy and accompanying Terms of Use, when you sign up to access and use the App, you acknowledge that you have read, understood and agree to be legally bound by the terms of this Privacy Policy and the accompanying Terms of Use.</p>
          
          <h3 className="font-bold text-lg mt-6">The Information We Collect and/or Receive</h3>
          <p>In the course of operating the App, and/or interacting with you, we will collect (and/or receive) the following types of information.</p>
          
          <h4 className="font-semibold mt-4">1. Contact Information</h4>
          <p>If you contact us for support via email or customer support contact form, you will have to provide your email address. The Contact Information is used to provide the requested service or information.</p>
          
          <h4 className="font-semibold mt-4">2. Mental Health Related Information</h4>
          <p>The App allows you to track and monitor your mental health. Your Mental Health Related Information is stored within the App on your device. Your Mental Health Related Information is transmitted to Avocado in an anonymous way to be analyzed by our AI models and send back information to your device. No data is permanently stored or sent to any other person or entity.</p>
          
          <h4 className="font-semibold mt-4">3. Other Information</h4>
          <p>We may collect information automatically when you use the App, including IP addresses, browser type, device information, and usage data. We use cookies and third-party analytics services like Google Firebase.</p>
          
          <h3 className="font-bold text-lg mt-6">How We Use and Share the Information</h3>
          <p>We use your Information to provide you the App, solicit your feedback, inform you about our products and services, and to improve our App. We may share information with service providers, in aggregated form, during business transfers, or when required by law.</p>
          
          <h3 className="font-bold text-lg mt-6">How We Protect the Information</h3>
          <p>We take commercially reasonable steps to protect your Information from loss, misuse, and unauthorized access. However, no security system is impenetrable, and we cannot guarantee absolute security.</p>
          
          <h3 className="font-bold text-lg mt-6">Children's Information</h3>
          <p>We do not knowingly collect personal information from children under the age of 18 through the App. If you are under 18, please do not give us any personal information.</p>
          
          <h3 className="font-bold text-lg mt-6">Important Notice to Non-U.S. Residents</h3>
          <p>The App and its servers are operated in the United States. If you are located outside of the United States, your information may be transferred to, processed, and maintained in the United States.</p>
          
          <h3 className="font-bold text-lg mt-6">Changes to This Privacy Policy</h3>
          <p>We may change this Privacy Policy from time to time. Any such changes will be posted on the App. By continuing to use the App after changes are posted, you accept such changes.</p>
          
          <h3 className="font-bold text-lg mt-6">How to Contact Us</h3>
          <p>If you have questions about this Privacy Policy, please contact us:</p>
          <p>Email: <a href="mailto:support@youravocado.app" className="text-blue-600 hover:underline">support@youravocado.app</a></p>
          <p className="text-sm">AvocadoAI LLC<br/>605 Geddes Street<br/>Wilmington, Delaware 19805<br/>County of New Castle, USA</p>
        </div>
      </Modal>
    </div>
  );
}

