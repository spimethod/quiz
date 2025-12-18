'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import QuizLayout from '../../components/QuizLayout';

export default function TimePage() {
  const router = useRouter();
  const CURRENT_STEP = 27;
  const TOTAL_STEPS = 32;

  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  const timeOptions = [5, 10, 15, 30, 40, 60];

  const handleSelect = (time: number) => {
    setSelectedTime(time);
    // Reset commitment flag when time changes
    localStorage.removeItem('commitmentSigned');
    // Reset personalization params to force progress bars restart
    localStorage.removeItem('lastPersonalizationParams');
  };

  const handleContinue = () => {
    if (selectedTime === null) return;
    if (typeof window !== 'undefined') {
      localStorage.setItem('timeCommitment', selectedTime.toString());
    }
    router.push('/quiz/results');
  };

  // Constants for SVG
  const width = 300;
  const height = 150;
  const startPoint = { x: 0, y: 142 }; // Today at the bottom

  // Calculate curve based on selected time
  const curveData = useMemo(() => {
    // Today is always at the bottom
    const todayY = startPoint.y; // 142
    const minY = 10; // Top boundary (leave some padding)
    const maxRange = todayY - minY; // Available vertical space (132px)
    
    // If no time selected, draw a flat horizontal line
    if (selectedTime === null) {
      const flatY = todayY;
      const endPoint = { x: width, y: flatY };
      const midPoint = { x: width * 0.5, y: flatY };
      const controlPoint = { x: width * 0.5, y: flatY };
      
      const pathD = `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`;
      const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;
      
      return { pathD, areaD, p0: startPoint, p1: controlPoint, p2: endPoint, midPoint };
    }
    
    // Fixed proportional values for each timeframe that fit within bounds
    // 60 min uses full range, others are proportionally smaller
    const getPositions = (time: number) => {
      switch (time) {
        case 5:  return { midRatio: 0.12, endRatio: 0.22 };  // Small progress
        case 10: return { midRatio: 0.18, endRatio: 0.32 };  // +50% from 5min
        case 15: return { midRatio: 0.25, endRatio: 0.42 };  // +39% from 10min
        case 30: return { midRatio: 0.38, endRatio: 0.58 };  // +52% from 15min
        case 40: return { midRatio: 0.48, endRatio: 0.72 };  // +26% from 30min
        case 60: return { midRatio: 0.60, endRatio: 0.92 };  // +50% from 40min (almost full)
        default: return { midRatio: 0.25, endRatio: 0.42 };
      }
    };
    
    const { midRatio, endRatio } = getPositions(selectedTime);
    
    const midY = todayY - (maxRange * midRatio);
    const endY = todayY - (maxRange * endRatio);
    
    const endPoint = { x: width, y: endY };
    
    // Middle point that curve must pass through at t=0.5
    const midPoint = { x: width * 0.5, y: midY };

    // Calculate control point so curve passes through midPoint at t=0.5
    // Formula: P1 = 2*M - 0.5*P0 - 0.5*P2 (derived from Bezier formula at t=0.5)
    const controlPoint = { 
      x: 2 * midPoint.x - 0.5 * startPoint.x - 0.5 * endPoint.x,
      y: 2 * midPoint.y - 0.5 * startPoint.y - 0.5 * endPoint.y
    };

    const pathD = `M ${startPoint.x} ${startPoint.y} Q ${controlPoint.x} ${controlPoint.y} ${endPoint.x} ${endPoint.y}`;
    
    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

    return { pathD, areaD, p0: startPoint, p1: controlPoint, p2: endPoint, midPoint };
  }, [selectedTime]);

  // Helper to get Y on quadratic Bezier for given t
  const getBezierY = (t: number, p0y: number, p1y: number, p2y: number) => {
    return Math.pow(1-t, 2) * p0y + 2 * (1-t) * t * p1y + Math.pow(t, 2) * p2y;
  };

  // Fixed marker points: Today, In 2 weeks (on curve), In 1 month
  const points = [
    { x: width * 0.02, y: startPoint.y },            // Today - at start
    { x: width * 0.5, y: curveData.midPoint.y },     // In 2 weeks - exactly on curve
    { x: width * 0.97, y: curveData.p2.y }           // In 1 month - at end
  ];

  const footerContent = (
    <div className="max-w-sm mx-auto w-full">
      <button
        onClick={handleContinue}
        onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
        disabled={selectedTime === null}
        className={`w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 rounded-xl transition-all duration-300 select-none ${
          selectedTime !== null
            ? 'bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );

  return (
    <QuizLayout
      currentStep={CURRENT_STEP}
      totalSteps={TOTAL_STEPS}
      footer={footerContent}
      className="px-4 sm:px-6 md:px-8 lg:px-10"
    >
      <div className="max-w-[600px] w-full mx-auto pt-4 sm:pt-6">
        
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#1a1a1a] mb-2 leading-tight">
          How much time do you want to spend on your mental health daily?
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 text-base sm:text-lg mb-8 px-4">
          {selectedTime !== null ? (
            <>Even <span className="font-bold text-[#6B9D47]">{selectedTime} minutes</span> a day with your 3D Avocado companion can make a difference</>
          ) : (
            <>Select how much time you want to dedicate to your mental health</>
          )}
        </p>

        {/* Graph Container */}
        <div className="relative w-full h-56 sm:h-64 bg-white rounded-xl border border-gray-100 shadow-sm mb-8 overflow-hidden">
          {/* Labels - Aligned with SVG bounds */}
          <div className="absolute bottom-3 left-4 text-xs font-medium text-gray-500">Today</div>
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500">In 2 weeks</div>
          <div className="absolute bottom-3 right-4 text-xs font-medium text-gray-500 whitespace-nowrap">In 1 month</div>

          {/* SVG Graph */}
          <div className="absolute inset-0 p-4 pb-8">
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
              <defs>
                {/* Mask for drawing animation */}
                <mask id="drawMask">
                  <motion.rect
                    key={`mask-${selectedTime}`}
                    x="0" 
                    y="0" 
                    height={height}
                    fill="white"
                    initial={{ width: 0 }}
                    animate={{ width: width }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </mask>
              </defs>

              {/* Area Fill (Under curve) - More saturated/solid */}
              <motion.path
                key={`area-${selectedTime}`}
                d={curveData.areaD}
                fill="#C8E6C9" // More saturated, solid color (light avocado green)
                fillOpacity="0.6" // Slight transparency
                stroke="none"
                mask="url(#drawMask)" // Same mask as main line for synchronized reveal
                initial={{ opacity: 0 }}
                animate={{ d: curveData.areaD, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />

              {/* Faint dashed guide lines above */}
              {[20, 40].map((offset, i) => {
                 const guideP0 = { ...curveData.p0, y: curveData.p0.y - offset };
                 const guideP1 = { ...curveData.p1, y: curveData.p1.y - offset };
                 const guideP2 = { ...curveData.p2, y: curveData.p2.y - offset };
                 const guideD = `M ${guideP0.x} ${guideP0.y} Q ${guideP1.x} ${guideP1.y} ${guideP2.x} ${guideP2.y}`;
                 return (
                   <motion.path
                     key={`guide-${i}-${selectedTime}`}
                     d={guideD}
                     fill="none"
                     stroke="#E5E7EB"
                     strokeWidth="1"
                     strokeDasharray="4 4"
                     mask="url(#drawMask)"
                     animate={{ d: guideD }}
                     transition={{ d: { duration: 0.5, ease: "easeInOut" } }}
                   />
                 )
              })}

              {/* Main Curve Line (Dashed) */}
              <motion.path
                key={`line-${selectedTime}`}
                d={curveData.pathD}
                fill="none"
                stroke="#6B9D47"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="12 12"
                mask="url(#drawMask)"
                animate={{ d: curveData.pathD }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              
              {/* Points on the line */}
              {points.map((p, i) => (
                <motion.g 
                  key={`point-${i}-${selectedTime}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + (i * 0.2), ease: "backOut" }}
                >
                  <circle cx="0" cy="0" r={i === 2 ? 8 : 5} fill="white" stroke="#6B9D47" strokeWidth="3" />
                </motion.g>
              ))}
            </svg>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {timeOptions.map((time) => (
            <button
              key={time}
              onClick={() => handleSelect(time)}
              onTouchEnd={(e) => { e.preventDefault(); handleSelect(time); }}
              className={`py-3 sm:py-4 px-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-200 border-2 select-none ${
                selectedTime === time
                  ? 'bg-[#6B9D47] border-[#6B9D47] text-white shadow-md scale-[1.02]'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-[#6B9D47] hover:text-[#6B9D47]'
              }`}
            >
              {time} min
            </button>
          ))}
        </div>

      </div>
    </QuizLayout>
  );
}
