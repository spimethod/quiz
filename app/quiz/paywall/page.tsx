'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PaywallPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'weekly'>('annual');
  const [avatar, setAvatar] = useState('boy');

  useEffect(() => {
    const savedAvatar = localStorage.getItem('avatarPreference');
    if (savedAvatar) {
      setAvatar(savedAvatar);
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
      <main className="flex-1 flex flex-col items-center px-4 pb-[280px]"> {/* Large padding bottom for fixed footer */}
        
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
        <div className="text-center max-w-lg mx-auto mb-4 mt-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-3 leading-tight px-4">
            Get full access to your personal mental-wellbeing journey with Avocado AI Therapist
          </h1>
          <p className="text-gray-500 text-base sm:text-lg px-4 mt-8">
            200× cheaper than a traditional therapist<br />with everyday check-ins
          </p>
        </div>

        {/* Social Proof */}
        <div className="bg-[#e8f5e9] rounded-2xl p-4 sm:p-6 w-full max-w-2xl mx-auto mb-8 mt-4">
           <div className="flex flex-col items-center">
             <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold text-[#1a1a1a]">4.8</span>
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
             </div>
             
             <div className="flex items-center gap-8 text-sm sm:text-base font-semibold text-gray-700">
                <div className="flex items-center gap-1">
                   <span className="text-[#5c3b2e]">🌿</span>
                   <span>100K+ Users</span>
                </div>
                <div className="flex items-center gap-1">
                   <span className="text-[#5c3b2e]">🌿</span>
                   <span>30K+ Reviews</span>
                </div>
             </div>
           </div>
        </div>

      </main>

      {/* Sticky Footer - Payment Options */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
        <div className="max-w-md mx-auto p-4 pb-8">
          
          <div className="space-y-3 mb-4">
            {/* Annual Plan */}
            <div 
              onClick={() => setSelectedPlan('annual')}
              className={`relative flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === 'annual' ? 'border-[#6B9D47] bg-[#f0f9eb]' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="absolute -top-3 right-4 bg-[#6B9D47] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                7-DAY FREE TRIAL
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${selectedPlan === 'annual' ? 'border-[#6B9D47]' : 'border-gray-300'}`}>
                {selectedPlan === 'annual' && <div className="w-2.5 h-2.5 rounded-full bg-[#6B9D47]" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1a1a1a]">Annual</span>
                  <span className="font-bold text-[#1a1a1a]">$59.99</span>
                </div>
                <div className="text-xs text-gray-500">1 year • $1.15/week</div>
              </div>
            </div>

            {/* Weekly Plan */}
            <div 
              onClick={() => setSelectedPlan('weekly')}
              className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === 'weekly' ? 'border-[#6B9D47] bg-[#f0f9eb]' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${selectedPlan === 'weekly' ? 'border-[#6B9D47]' : 'border-gray-300'}`}>
                {selectedPlan === 'weekly' && <div className="w-2.5 h-2.5 rounded-full bg-[#6B9D47]" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1a1a1a]">Weekly</span>
                  <span className="font-bold text-[#1a1a1a]">$1.38</span>
                </div>
                <div className="text-xs text-gray-500">1 week • $1.38</div>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 mb-3">Cancel anytime</div>

          <button 
            onClick={handleContinue}
            className="w-full py-4 rounded-xl bg-[#6B9D47] text-white font-bold text-lg hover:bg-[#5d8a3d] transition-all hover:scale-[1.02] active:scale-95 shadow-md mb-4"
          >
            Continue
          </button>

          <div className="flex justify-center gap-6 text-[10px] text-gray-400 font-medium">
             <button className="hover:text-gray-600 transition-colors">Restore Purchases</button>
             <button className="hover:text-gray-600 transition-colors">Terms</button>
             <button className="hover:text-gray-600 transition-colors">Privacy</button>
          </div>

        </div>
      </footer>
    </div>
  );
}

