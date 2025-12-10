'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import QuizLayout from '../../components/QuizLayout';

export default function TimePage() {
  const router = useRouter();
  const CURRENT_STEP = 27;
  const TOTAL_STEPS = 32;

  const [selectedTime, setSelectedTime] = useState(5);

  const timeOptions = [5, 10, 15, 30, 40, 60];

  const handleSelect = (time: number) => {
    setSelectedTime(time);
    // Reset commitment flag when time changes
    localStorage.removeItem('commitmentSigned');
    // Reset personalization params to force progress bars restart
    localStorage.removeItem('lastPersonalizationParams');
  };

  const handleContinue = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timeCommitment', selectedTime.toString());
    }
    router.push('/quiz/results');
  };

  // Constants for SVG
  const width = 300;
  const height = 150;
  const startPoint = { x: 0, y: 120 };

  // Helper to find t for a given X on a Quadratic Bezier curve
  // Solves: a*t^2 + b*t + c = 0
  const getTforX = (targetX: number, p0x: number, p1x: number, p2x: number) => {
    const a = p0x - 2 * p1x + p2x;
    const b = 2 * (p1x - p0x);
    const c = p0x - targetX;

    if (Math.abs(a) < 1e-6) {
      // Linear case
      return -c / b;
    }

    const sqrtVal = Math.sqrt(Math.pow(b, 2) - 4 * a * c);
    const t1 = (-b + sqrtVal) / (2 * a);
    const t2 = (-b - sqrtVal) / (2 * a);

    // Return valid t in [0, 1]
    if (t1 >= 0 && t1 <= 1) return t1;
    return t2;
  };

  // Calculate curve points based on selected time
  const curveData = useMemo(() => {
    // Create equal visual spacing between all time options
    const getEndY = (time: number) => {
      switch (time) {
        case 5:  return 110; // Lowest point
        case 10: return 90;  // +20px visual difference
        case 15: return 70;  // +20px visual difference  
        case 30: return 50;  // +20px visual difference
        case 40: return 30;  // +20px visual difference
        case 60: return 10;  // +20px visual difference (highest)
        default: return 70;
      }
    };
    
    const endY = getEndY(selectedTime);
    const endPoint = { x: width, y: endY };

    // Make control point dynamic to affect middle section visibility
    // Higher time values pull the control point up slightly
    const timeRatio = (selectedTime - 5) / (60 - 5); // 0 to 1
    const controlPoint = { 
      x: width * 0.7, 
      y: height - 5 - (timeRatio * 20) // Control point rises with time, affecting middle curve
    };

    const pathD = `M ${startPoint.x} ${startPoint.y} Q ${controlPoint.x} ${controlPoint.y} ${endPoint.x} ${endPoint.y}`;
    
    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

    return { pathD, areaD, p0: startPoint, p1: controlPoint, p2: endPoint };
  }, [selectedTime]);

  // Helper to get Y for a given t (we already found t for specific X)
  const getBezierY = (t: number, p0y: number, p1y: number, p2y: number) => {
    return Math.pow(1-t, 2) * p0y + 2 * (1-t) * t * p1y + Math.pow(t, 2) * p2y;
  };

  // Calculate markers
  // Targets: 2% (Today), 50% (In 2 weeks), 97% (In 1 month)
  const targetPercents = [0.02, 0.5, 0.97];
  const points = targetPercents.map(pct => {
    const targetX = width * pct;
    const t = getTforX(targetX, curveData.p0.x, curveData.p1.x, curveData.p2.x);
    const y = getBezierY(t, curveData.p0.y, curveData.p1.y, curveData.p2.y);
    return { x: targetX, y };
  });

  const footerContent = (
    <div className="max-w-sm mx-auto w-full">
      <button
        onClick={handleContinue}
        onTouchEnd={(e) => { e.preventDefault(); handleContinue(); }}
        className="w-full font-semibold text-base sm:text-lg md:text-xl py-3 px-12 rounded-xl bg-[#6B9D47] hover:bg-[#5d8a3d] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 select-none"
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
          Even <span className="font-bold text-[#6B9D47]">{selectedTime} minutes</span> a day with your 3D Avocado companion can make a difference
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
              {[15, 30].map((offset, i) => {
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
