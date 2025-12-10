'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface GenderCardProps {
  gender: 'male' | 'female';
  imageUrl: string;
  label: string;
}

export default function GenderCard({ gender, imageUrl, label }: GenderCardProps) {
  const router = useRouter();

  const handleClick = () => {
    // Store gender in localStorage or pass as query param
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedGender', gender);
    }
    // Navigate to age selection page
    router.push('/quiz/age');
  };

  return (
    <div 
      onClick={handleClick}
      onTouchEnd={(e) => { e.preventDefault(); handleClick(); }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 flex flex-col max-w-sm w-full select-none"
    >
      <div className="relative w-full aspect-[3/4] bg-gray-100">
        <Image
          src={imageUrl}
          alt={label}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div 
        className="bg-[#6B9D47] hover:bg-[#5d8a3d] transition-colors text-white p-4 flex items-center justify-between group"
      >
        <span className="text-xl font-medium">{label}</span>
        <svg 
          className="w-6 h-6 transition-transform group-hover:translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

