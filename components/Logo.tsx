import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className = "w-40 h-auto", iconOnly = false }: LogoProps) {
  return (
    <svg 
      viewBox={iconOnly ? "0 0 120 120" : "0 0 650 120"} 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Icon Group */}
      <g className="text-blue-600 dark:text-blue-500" stroke="currentColor" strokeWidth="12" strokeLinecap="square" strokeLinejoin="miter">
        {/* Line graph going up */}
        <path d="M 15 90 L 35 90 L 55 55 L 75 55 L 95 20" />
        
        {/* Arrow head */}
        <polygon points="108,8 80,12 100,32" fill="currentColor" stroke="none" />
        
        {/* The circular / J curve part */}
        <path d="M 50 65 C 45 105 105 110 105 65 L 105 32" strokeLinecap="round" />
      </g>
      
      {/* Text Group */}
      {!iconOnly && (
        <text 
          x="135" 
          y="82" 
          fontFamily="Inter, system-ui, -apple-system, sans-serif" 
          fontWeight="800" 
          fontSize="64" 
          fill="currentColor"
          className="text-slate-900 dark:text-white"
          letterSpacing="-1.5"
        >
          JourneyWise
        </text>
      )}
    </svg>
  );
}
