import React from 'react';

export const Logo = ({ showText = true, tagline = "YOUR SUCCESS, OUR MISSION", className = "" }) => {
  const linesCount = 7;
  
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Wave Graphic SVG */}
      <svg 
        viewBox="0 0 110 50" 
        className="w-12 h-10 select-none shrink-0" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#22d3ee" />   {/* Cyan */}
            <stop offset="35%" stopColor="#3b82f6" />  {/* Blue */}
            <stop offset="70%" stopColor="#a855f7" />  {/* Purple */}
            <stop offset="100%" stopColor="#ec4899" /> {/* Pink */}
          </linearGradient>
        </defs>
        
        {/* Render parallel wave lines */}
        {Array.from({ length: linesCount }).map((_, i) => {
          const step = i * 2.2;
          return (
            <g key={i} opacity={0.95 - (i * 0.12)} stroke="url(#waveGrad)" strokeWidth="1.2" strokeLinecap="round" fill="none">
              {/* Upper Wave Set */}
              <path d={`M 8,25 C 26,${4 + step} 38,${4 + step} 53,25 C 68,${46 - step} 80,${4 - step} 98,25`} />
              {/* Lower Wave Set */}
              <path d={`M 8,25 C 26,${46 - step} 38,${46 - step} 53,25 C 68,${4 + step} 80,${46 - step} 98,25`} />
            </g>
          );
        })}

        {/* Center Accent Line */}
        <path 
          d="M 20,25 C 36,20 46,30 58,25 C 70,20 80,30 96,25" 
          stroke="url(#waveGrad)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          fill="none" 
          opacity="0.8"
        />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="text-[19px] font-black tracking-[0.1em] leading-none font-outfit bg-gradient-to-r from-[#3b82f6] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
            ADSVERZ
          </span>
          {tagline && (
            <span className="text-[6.5px] font-bold uppercase tracking-[0.22em] text-white mt-1.5 whitespace-nowrap">
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
