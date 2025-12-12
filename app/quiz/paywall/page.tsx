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

      </main>

      {/* Sticky Footer - Payment Options (Ultra Compact Style) */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 flex justify-center sm:pb-6 pointer-events-none">
        <div className="bg-white w-full sm:max-w-[500px] rounded-t-[32px] sm:rounded-[32px] px-4 pt-4 pb-3 sm:pb-6 shadow-[0_-10px_60px_rgba(0,0,0,0.08)] pointer-events-auto border-t border-gray-100 sm:border-none">
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

          <div className="flex justify-center gap-6 text-[9px] text-gray-400 font-medium pb-0">
             <button onClick={() => setActiveModal('terms')} className="hover:text-gray-600 transition-colors">Terms of Service</button>
             <button onClick={() => setActiveModal('privacy')} className="hover:text-gray-600 transition-colors">Privacy Policy</button>
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

