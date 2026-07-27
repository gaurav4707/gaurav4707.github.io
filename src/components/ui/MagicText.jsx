import React from 'react';
import { motion } from 'framer-motion';

export const MagicText = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`relative ${className}`}
    >
      {/* Subtle shimmer effect that only runs once on reveal */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        initial={{ backgroundPosition: '200% 0', opacity: 1 }}
        whileInView={{ backgroundPosition: '-200% 0', opacity: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, var(--color-primary) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent'
        }}
      >
        {children}
      </motion.div>
      
      {/* Actual readable text */}
      <div className="relative z-0">
        {children}
      </div>
    </motion.div>
  );
};
