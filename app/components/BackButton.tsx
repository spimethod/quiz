'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  className?: string;
  onClick?: () => void;
}

export default function BackButton({ className = '', onClick }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-1.5 sm:p-2 hover:bg-gray-200 rounded-full transition-all duration-200 hover:scale-110 ${className}`}
      aria-label="Go back"
    >
      <svg 
        className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-800" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}
