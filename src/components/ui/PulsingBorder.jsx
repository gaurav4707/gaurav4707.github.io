import React from 'react';

/**
 * PulsingBorder – A wrapper component that renders a continuously
 * rotating green conic-gradient border around its children.
 *
 * Pure CSS animation – no framer-motion dependency required.
 */
export const PulsingBorder = ({ children, className = '' }) => {
  return (
    <div className={`relative w-full overflow-hidden rounded-[14px] p-[1.5px] group ${className}`}>
      {/* Rotating conic-gradient border layer */}
      <div
        className="absolute inset-0 z-0 animate-[spin-border_6s_linear_infinite]"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg 300deg, #4ADE80 330deg, #22c55e 360deg)',
          filter: 'blur(1.5px)',
        }}
      />
      {/* Soft green glow pulse overlay for the ambient "breathing" effect */}
      <div
        className="absolute inset-0 z-0 rounded-[14px] animate-[pulse-glow_3s_ease-in-out_infinite]"
        style={{
          boxShadow: '0 0 15px 2px rgba(74, 222, 128, 0.15), inset 0 0 15px 2px rgba(74, 222, 128, 0.05)',
        }}
      />

      {/* Inner container – pitch black interior to mask the gradient center */}
      <div className="relative z-10 w-full h-full bg-[#0a0a0a] rounded-[13px] p-6 md:p-10">
        {children}
      </div>
    </div>
  );
};
