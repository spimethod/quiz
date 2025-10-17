'use client';

import { useEffect, useState } from 'react';

export default function ScaleWrapper({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const zoomLevel = window.devicePixelRatio;
      if (zoomLevel > 1) {
        setScale(1 / zoomLevel);
      } else {
        setScale(1);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
      {children}
    </div>
  );
}
