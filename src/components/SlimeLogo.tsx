export default function SlimeLogo({ size = 32 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="slimeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#a855f7' }} />
          <stop offset="50%" style={{ stopColor: '#d946ef' }} />
          <stop offset="100%" style={{ stopColor: '#ec4899' }} />
        </linearGradient>
      </defs>
      {/* Main slime body */}
      <ellipse cx="50" cy="60" rx="38" ry="28" fill="url(#slimeGrad)" />
      {/* Dripping effect */}
      <path 
        d="M18 48 Q22 25 32 38 Q40 50 50 42 Q60 34 68 46 Q78 30 82 48 Q88 58 82 62 L18 62 Q12 58 18 48" 
        fill="url(#slimeGrad)" 
      />
      {/* Shine highlights */}
      <ellipse cx="32" cy="52" rx="8" ry="5" fill="rgba(255,255,255,0.4)" />
      <circle cx="68" cy="50" r="4" fill="rgba(255,255,255,0.3)" />
      {/* Eyes */}
      <ellipse cx="36" cy="62" rx="7" ry="9" fill="white" />
      <ellipse cx="64" cy="62" rx="7" ry="9" fill="white" />
      <circle cx="38" cy="64" r="4" fill="#1e1b4b" />
      <circle cx="66" cy="64" r="4" fill="#1e1b4b" />
      {/* Eye shine */}
      <circle cx="36" cy="62" r="1.5" fill="white" />
      <circle cx="64" cy="62" r="1.5" fill="white" />
      {/* Smile */}
      <path 
        d="M40 74 Q50 82 60 74" 
        stroke="#1e1b4b" 
        strokeWidth="3" 
        fill="none" 
        strokeLinecap="round" 
      />
    </svg>
  );
}
