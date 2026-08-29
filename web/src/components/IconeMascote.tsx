import React from 'react';

interface IconeMascoteProps {
  className?: string;
  size?: number | string;
}

export function IconeMascote({ className = 'w-8 h-8', size }: IconeMascoteProps) {
  return (
    <svg
      viewBox="0 0 120 135"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 select-none ${className}`}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Mascote Mini-Kanban"
    >
      <defs>
        <linearGradient id="gradienteCorpo" x1="0" y1="20" x2="120" y2="135" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="50%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </linearGradient>

        <linearGradient id="gradienteInterior" x1="30" y1="30" x2="110" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.3" />
        </linearGradient>

        <filter id="brilhoSuave" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect
        x="18"
        y="21"
        width="84"
        height="102"
        rx="18"
        fill="#0F172A"
        opacity="0.12"
      />
      <rect
        x="17"
        y="18"
        width="86"
        height="104"
        rx="18"
        fill="url(#gradienteCorpo)"
        stroke="#1E293B"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <path
        d="M 28 35 Q 55 32 60 50 Q 65 75 90 60 Q 95 55 96 68 L 96 110 Q 96 116 90 116 L 30 116 Q 24 116 24 110 L 24 45 Q 24 35 28 35 Z"
        fill="url(#gradienteInterior)"
      />
      <circle cx="32" cy="27" r="4.2" fill="#0284C7" stroke="#1E293B" strokeWidth="2.5" />
      <circle cx="46" cy="27" r="4.2" fill="#0284C7" stroke="#1E293B" strokeWidth="2.5" />
      <circle cx="60" cy="27" r="4.2" fill="#0284C7" stroke="#1E293B" strokeWidth="2.5" />
      <circle cx="74" cy="27" r="4.2" fill="#0284C7" stroke="#1E293B" strokeWidth="2.5" />
      <circle cx="88" cy="27" r="4.2" fill="#0284C7" stroke="#1E293B" strokeWidth="2.5" />
      <g stroke="#1E293B" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M 31 27 C 27 19 32 9 35 9 C 39 9 38 18 33 27" />
        <path d="M 45 27 C 41 19 46 9 49 9 C 53 9 52 18 47 27" />
        <path d="M 59 27 C 55 19 60 9 63 9 C 67 9 66 18 61 27" />
        <path d="M 73 27 C 69 19 74 9 77 9 C 81 9 80 18 75 27" />
        <path d="M 87 27 C 83 19 88 9 91 9 C 95 9 94 18 89 27" />
      </g>
      <g>
        <ellipse cx="49" cy="43" rx="4.5" ry="5.5" fill="#1E293B" />
        <circle cx="47.5" cy="41" r="1.8" fill="#FFFFFF" />
        <circle cx="50.5" cy="44.5" r="0.9" fill="#FFFFFF" />
        <circle cx="48" cy="46" r="0.6" fill="#FFFFFF" />
      </g>
      <g>
        <ellipse cx="71" cy="43" rx="4.5" ry="5.5" fill="#1E293B" />
        <circle cx="69.5" cy="41" r="1.8" fill="#FFFFFF" />
        <circle cx="72.5" cy="44.5" r="0.9" fill="#FFFFFF" />
        <circle cx="70" cy="46" r="0.6" fill="#FFFFFF" />
      </g>
      <ellipse cx="43" cy="48" rx="3.5" ry="2.2" fill="#F472B6" opacity="0.9" />
      <ellipse cx="77" cy="48" rx="3.5" ry="2.2" fill="#F472B6" opacity="0.9" />
      <path
        d="M 56 47.5 C 57.5 53 62.5 53 64 47.5"
        stroke="#1E293B"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <g stroke="#1E293B" strokeWidth="3" strokeLinecap="round" opacity="0.9">
        <line x1="31" y1="60" x2="89" y2="60" />
        <line x1="31" y1="73" x2="89" y2="73" />
        <line x1="31" y1="86" x2="89" y2="86" />
        <line x1="31" y1="99" x2="89" y2="99" />
        <line x1="40" y1="111" x2="80" y2="111" />
      </g>
      <path
        d="M 94 37 Q 94 43 100 43 Q 94 43 94 49 Q 94 43 88 43 Q 94 43 94 37 Z"
        fill="#FFFFFF"
        filter="url(#brilhoSuave)"
      />
      <path
        d="M 97 54 Q 97 58 101 58 Q 97 58 97 62 Q 97 58 93 58 Q 97 58 97 54 Z"
        fill="#FFFFFF"
      />
      <path
        d="M 23 98 Q 23 104 29 104 Q 23 104 23 110 Q 23 104 17 104 Q 23 104 23 98 Z"
        fill="#FFFFFF"
        filter="url(#brilhoSuave)"
      />
      <circle cx="86" cy="49" r="1" fill="#FFFFFF" />
      <circle cx="28" cy="109" r="1.2" fill="#FFFFFF" />
    </svg>
  );
}
