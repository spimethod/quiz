'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Modal from './components/Modal';

export default function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleGenderSelect = (gender: 'male' | 'female') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedGender', gender);
    }
    router.push('/quiz/reviews');
  };

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
      className="fixed inset-0 flex flex-col bg-[#f5f5f0] animate-fadeIn overflow-hidden" 
      style={{ 
        overscrollBehavior: 'none',
        touchAction: 'none',
        position: 'fixed'
      }}
    >
      {/* Header with Logo - In flow, not fixed */}
      <header className="flex-shrink-0 pt-3 sm:pt-4 flex justify-center bg-[#f5f5f0] safe-area-top">
        <Image
          src="/avocado-logo.png"
          alt="Avocado"
          width={200}
          height={64}
          priority
          className="h-8 sm:h-10 md:h-12 w-auto"
        />
      </header>

      {/* Main Content - Responsive layout that fits screen */}
      <main className="flex-1 flex flex-col items-center justify-start gap-2 px-4 max-w-md sm:max-w-lg mx-auto w-full pt-6 pb-4 sm:pb-6 min-h-0">
        {/* Top Content */}
        <div className="flex flex-col items-center w-full">
          {/* Main Title */}
          <h1 className="text-[clamp(1.25rem,5vw,1.875rem)] font-extrabold text-center text-[#1a1a1a] leading-tight mb-2 uppercase tracking-tight">
            GET YOUR PERSONAL<br />MENTAL HEALTH<br />REPORT
          </h1>

          {/* Description Text */}
          <p className="text-center text-gray-600 text-[clamp(0.65rem,2.5vw,0.875rem)] leading-relaxed mb-2 px-2 text-justify">
            Receive an <span className="font-bold text-gray-800">AI-powered</span> evaluation with <span className="font-bold text-gray-800">tailored advice</span> and a <span className="font-bold text-gray-800">clear improvement plan</span> — guided by <span className="font-bold text-gray-800">Avocado</span>, your <span className="font-bold text-gray-800">AI companion</span>.
          </p>

          {/* Subtitle */}
          <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a] uppercase mb-0 tracking-wide">
            3-MINUTE QUIZ
          </h2>
        </div>

        {/* Illustration Row - Fixed height relative to viewport to prevent stretching */}
        <div className="flex justify-center items-end w-full gap-0 h-[38vh] px-2 mt-1 mb-1">
          {/* Female Door */}
          <div className="relative w-[30%] h-full max-h-[28vh] flex-shrink-0">
            <Image
              src="/door-female.png"
              alt="Female Door"
              fill
              className="object-contain object-bottom mix-blend-multiply"
              priority
            />
          </div>

          {/* Avocado Character */}
          <div className="relative w-[45%] h-full max-h-[32vh] flex-shrink-0 -mb-2 z-10 -mx-4">
            <Image
              src="/home-avocado.png"
              alt="Avocado Character"
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>

          {/* Male Door */}
          <div className="relative w-[30%] h-full max-h-[28vh] flex-shrink-0">
            <Image
              src="/door-male.png"
              alt="Male Door"
              fill
              className="object-contain object-bottom mix-blend-multiply"
              priority
            />
          </div>
        </div>

        {/* Bottom Content */}
        <div className="flex flex-col items-center w-full mt-1">
          {/* Buttons */}
          <div className="flex flex-row gap-3 w-full mb-3 px-2">
            <button
              onClick={() => handleGenderSelect('female')}
              onTouchEnd={(e) => { e.preventDefault(); handleGenderSelect('female'); }}
              className="flex-1 bg-[#7da35e] hover:bg-[#6b8f4f] text-white font-semibold text-base md:text-lg py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-between shadow-sm active:scale-95 hover:scale-105 cursor-pointer transform select-none"
            >
              <span>Female</span>
              <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button
              onClick={() => handleGenderSelect('male')}
              onTouchEnd={(e) => { e.preventDefault(); handleGenderSelect('male'); }}
              className="flex-1 bg-[#7da35e] hover:bg-[#6b8f4f] text-white font-semibold text-base md:text-lg py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-between shadow-sm active:scale-95 hover:scale-105 cursor-pointer transform select-none"
            >
              <span>Male</span>
              <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Footer Links */}
          <div className="text-[10px] text-center text-gray-500 leading-tight max-w-xs mx-auto">
            <p>
              By clicking "Male" or "Female" you agree with the{' '}
              <button onClick={() => setActiveModal('terms')} onTouchEnd={(e) => { e.preventDefault(); setActiveModal('terms'); }} className="text-blue-500 hover:underline select-none">Terms of Use and Service</button>,{' '}
              <button onClick={() => setActiveModal('privacy')} onTouchEnd={(e) => { e.preventDefault(); setActiveModal('privacy'); }} className="text-blue-500 hover:underline select-none">Privacy Policy</button>,{' '}
              <button onClick={() => setActiveModal('subscription')} onTouchEnd={(e) => { e.preventDefault(); setActiveModal('subscription'); }} className="text-blue-500 hover:underline select-none">Subscription Policy</button>{' '}
              and{' '}
              <button onClick={() => setActiveModal('cookie')} onTouchEnd={(e) => { e.preventDefault(); setActiveModal('cookie'); }} className="text-blue-500 hover:underline select-none">Cookie Policy</button>.
            </p>
          </div>
        </div>
      </main>

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
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <p>Email: <a href="mailto:support@youravocado.app" className="text-blue-600 hover:underline">support@youravocado.app</a></p>
          <p className="text-sm">AvocadoAI LLC<br/>605 Geddes Street<br/>Wilmington, Delaware 19805<br/>County of New Castle, USA</p>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'subscription'}
        onClose={() => setActiveModal(null)}
        title="Subscription Policy"
      >
        <div className="text-gray-700 space-y-4">
          <h3 className="font-bold text-lg">Subscription</h3>
          <p>Avocado may allow its users ("Customers") to access certain features of the App for a recurring subscription fee ("Subscription").</p>
          <p>Avocado Subscriptions are intended and authorized only for personal, non-transferable, and non-resalable use.</p>
          <p>By purchasing a Subscription, you agree to an initial and recurring fee at the then-current rate, and you accept responsibility for all recurring charges until you cancel your Subscription. Your Subscription continues until canceled by you or until we terminate your access in accordance with these Terms.</p>
          <p>You may cancel your Subscription at any time, subject to the terms below.</p>
          
          <h3 className="font-bold text-lg mt-6">Automatic Renewal Terms</h3>
          <p>Once you subscribe, the applicable app store (Apple App Store or Google Play) will automatically charge your Subscription fee on each renewal date using the payment method linked to your account.</p>
          <p>Your Subscription automatically renews at the then-current rate each billing period until canceled. To stop charges, you must cancel at least 24 hours before the end of your current billing cycle.</p>
          <p>We do not provide refunds or credits for partial periods, unused features, or accidental renewals unless required by law.</p>
          
          <h3 className="font-bold text-lg mt-6">Subscription Cancellation</h3>
          <p>Canceling your Subscription disables automatic renewal, but you will retain access to Premium features until the end of your current paid period. Deleting the App does not cancel your Subscription.</p>
          
          <p className="font-semibold mt-4">If you subscribed through the Apple App Store:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Go to Settings → [Your Name] → Subscriptions.</li>
            <li>Cancel at least 24 hours before renewal to avoid being charged.</li>
            <li>Learn more on Apple's support page.</li>
          </ul>
          
          <p className="font-semibold mt-4">If you subscribed through Google Play:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Open Google Play → Menu → Payments & Subscriptions → Subscriptions.</li>
            <li>Cancel at least 24 hours before renewal to avoid being charged.</li>
            <li>Learn more on Google's support page.</li>
          </ul>
          
          <p className="font-semibold mt-4">If you subscribed through Avocado's website (if applicable):</p>
          <p>You can cancel by clicking "Cancel Subscription" in your account settings or by contacting us at <a href="mailto:support@youravocado.app" className="text-blue-600 hover:underline">support@youravocado.app</a> before the end of your current period.</p>
          
          <h3 className="font-bold text-lg mt-6">Free Trial</h3>
          <p>Avocado may offer a free trial period for new users. If you do not cancel before the trial expires, the subscription automatically converts to a paid plan and the regular fee will be charged to your payment method.</p>
          <p>Trial terms, duration, and pricing are displayed in the App before you confirm activation.</p>
          
          <h3 className="font-bold text-lg mt-6">Changes to Subscription Terms</h3>
          <p>We may modify, suspend, or discontinue any plan, feature, or price. If a material change affects your ongoing Subscription, you will be notified in advance.</p>
          <p>Your continued use of Avocado after such changes constitutes acceptance of the updated terms.</p>
          
          <h3 className="font-bold text-lg mt-6">Contact</h3>
          <p>For questions regarding your Subscription, billing, or cancellation, contact: <a href="mailto:support@youravocado.app" className="text-blue-600 hover:underline">support@youravocado.app</a></p>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'cookie'}
        onClose={() => setActiveModal(null)}
        title="Cookie Policy"
      >
        <div className="text-gray-700 space-y-4">
          <h3 className="font-bold text-lg">Overview</h3>
          <p>This Cookie Policy ("Policy") explains what cookies are, which types we use when you visit or interact with Avocado, and how we use them. It also covers similar technologies such as SDKs and web beacons.</p>
          <p>This Policy does not describe our general data practices — for that, please refer to our Privacy Policy.</p>
          
          <h3 className="font-bold text-lg mt-6">What Are Cookies</h3>
          <p>Cookies are small text files placed on your device or browser when you access our App or website. They store information like preferences, login data, and analytics metrics to enhance usability and performance.</p>
          <p>Cookies can be classified as session, persistent, first-party, or third-party.</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Session cookies</strong> expire when you close your browser.</li>
            <li><strong>Persistent cookies</strong> remain until manually deleted or expired.</li>
            <li><strong>First-party cookies</strong> are set directly by Avocado.</li>
            <li><strong>Third-party cookies</strong> are set by trusted service providers assisting us with analytics, performance, and security.</li>
          </ul>
          
          <h3 className="font-bold text-lg mt-6">Cookies and Similar Technologies We Use</h3>
          <p>We use the following categories of cookies and tools:</p>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Category</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Authentication</td>
                  <td className="border border-gray-300 px-4 py-2">Remember login credentials and user sessions for faster access.</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Security</td>
                  <td className="border border-gray-300 px-4 py-2">Enable security features and detect suspicious or unauthorized activity.</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Performance & Analytics</td>
                  <td className="border border-gray-300 px-4 py-2">Measure engagement, page performance, and feature usage to improve functionality.</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Preferences</td>
                  <td className="border border-gray-300 px-4 py-2">Store language, display, and notification settings for a personalized experience.</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Advertising (when applicable)</td>
                  <td className="border border-gray-300 px-4 py-2">Deliver relevant promotional content and limit repetitive ads.</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h3 className="font-bold text-lg mt-6">Third-Party Cookies</h3>
          <p>Avocado collaborates with reputable analytics and infrastructure providers that may use cookies or SDKs. Examples include:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Google (Firebase Analytics):</strong> Used to track anonymized app usage data and performance metrics.</li>
            <li><strong>Cloudflare:</strong> Provides network security and identifies trusted web traffic.</li>
            <li><strong>Zendesk (or similar provider, if integrated):</strong> Manages customer support requests and ensures faster response times.</li>
          </ul>
          <p className="mt-2">These partners do not collect or use your personal data for their own marketing. Their activity is governed by their respective privacy policies.</p>
          
          <h3 className="font-bold text-lg mt-6">Similar Technologies</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Web Beacons / Pixel Tags:</strong> Small graphic files that track engagement with emails or certain pages.</li>
            <li><strong>SDKs:</strong> Embedded code libraries within the App used for analytics, crash reporting, and diagnostics — similar in function to cookies, but for mobile environments.</li>
          </ul>
          
          <h3 className="font-bold text-lg mt-6">Why We Use Cookies</h3>
          <p>Cookies and SDKs help Avocado:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Maintain secure and efficient App functionality</li>
            <li>Understand how users interact with features</li>
            <li>Personalize recommendations and interface settings</li>
            <li>Improve overall service reliability and performance</li>
          </ul>
          
          <h3 className="font-bold text-lg mt-6">Managing Cookies</h3>
          <p>You can control or delete cookies through your browser or device settings. Note that disabling cookies may limit App functionality.</p>
          <p className="mt-2">Guides for major browsers:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Chrome:</strong> support.google.com/chrome/answer/95647</li>
            <li><strong>Safari:</strong> support.apple.com/guide/safari/manage-cookies</li>
            <li><strong>Firefox:</strong> support.mozilla.org/products/firefox/cookies</li>
            <li><strong>Edge:</strong> support.microsoft.com/microsoft-edge</li>
          </ul>
          
          <h3 className="font-bold text-lg mt-6">Updates</h3>
          <p>We may revise this Cookie Policy to reflect updates in our technology, practices, or legal requirements. The latest version will always be available within the App and on our website.</p>
          
          <h3 className="font-bold text-lg mt-6">Contact</h3>
          <p>If you have questions about this Policy or your data preferences, please contact: <a href="mailto:support@youravocado.app" className="text-blue-600 hover:underline">support@youravocado.app</a></p>
        </div>
      </Modal>
    </div>
  );
}
