import React from 'react'

export function CloverDecor({ 
  className, 
  style, 
  color 
}: { 
  className?: string
  style?: React.CSSProperties
  color?: string 
}) {
  const activeColor = color || "#2E6F40";
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <defs>
        {/* Silver metallic gradients for the realistic look */}
        <linearGradient id="clover-silver-base" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="25%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="75%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="clover-silver-highlight" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        
        {/* Base Heart Leaf pointing up (North) */}
        <path 
          id="clover-leaf-path" 
          d="M 0,-1.5 C -8,-1.5 -14,-6.5 -13,-15.5 C -12,-24.5 -5,-24.5 0,-16.5 C 5,-24.5 12,-24.5 13,-15.5 C 14,-6.5 8,-1.5 0,-1.5 Z" 
        />
      </defs>

      {/* 1. Silver Rim Base Group (contains stem, top loop, and clover base) */}
      <g>
        {/* Curved Stem at bottom */}
        <path 
          d="M 47.5,70 C 47.5,77 49,83.5 53.5,85.5 C 55,86.2 56,84.5 54.5,82.8 C 51.5,79.5 50.5,75.5 50.5,70 Z" 
          fill="url(#clover-silver-base)"
          stroke="url(#clover-silver-highlight)"
          strokeWidth="0.8"
        />

        {/* Top Loop (Eyelet) */}
        <path 
          d="M 50,17 A 6.5,6.5 0 1,0 50,30 A 6.5,6.5 0 1,0 50,17 Z M 50,20.25 A 3.25,3.25 0 1,1 50,26.75 A 3.25,3.25 0 1,1 50,20.25 Z" 
          fill="url(#clover-silver-base)"
          fillRule="evenodd"
          stroke="url(#clover-silver-highlight)"
          strokeWidth="0.8"
        />

        {/* Thick Silver Clover Silhouette Backdrop */}
        <g transform="translate(50, 52)" fill="url(#clover-silver-base)" stroke="url(#clover-silver-base)" strokeWidth="4" strokeLinejoin="round">
          <use href="#clover-leaf-path" transform="rotate(0)" />
          <use href="#clover-leaf-path" transform="rotate(90)" />
          <use href="#clover-leaf-path" transform="rotate(180)" />
          <use href="#clover-leaf-path" transform="rotate(270)" />
        </g>
        
        {/* Highlight ring outline around the silver backdrop */}
        <g transform="translate(50, 52)" fill="none" stroke="url(#clover-silver-highlight)" strokeWidth="1" strokeLinejoin="round">
          <use href="#clover-leaf-path" transform="rotate(0) scale(1.05)" />
          <use href="#clover-leaf-path" transform="rotate(90) scale(1.05)" />
          <use href="#clover-leaf-path" transform="rotate(180) scale(1.05)" />
          <use href="#clover-leaf-path" transform="rotate(270) scale(1.05)" />
        </g>
      </g>

      {/* 2. Inner Colored Leaves Group (dynamic fill color, scaled down to create the inset effect) */}
      <g transform="translate(50, 52)" fill={activeColor}>
        <use href="#clover-leaf-path" transform="rotate(0) scale(0.86)" />
        <use href="#clover-leaf-path" transform="rotate(90) scale(0.86)" />
        <use href="#clover-leaf-path" transform="rotate(180) scale(0.86)" />
        <use href="#clover-leaf-path" transform="rotate(270) scale(0.86)" />
      </g>
    </svg>
  );
}
