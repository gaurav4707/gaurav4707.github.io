
import * as React from "react"

import { motion } from "motion/react";

export interface MagicTextProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

const Word: React.FC<{ children: string; index: number }> = ({ children, index }) => {
  return (
    <>
      <motion.span
        initial={{ opacity: 0, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.4, delay: index * 0.015, ease: "easeOut" }}
        className="inline"
      >
        {children}
      </motion.span>
      {/* Explicit space after every word — prevents words from colliding */}
      <span aria-hidden="true"> </span>
    </>
  );
};

export const MagicText: React.FC<MagicTextProps> = ({ text, children, className = "" }) => {
  // Robustly extract a plain string from whatever children type is passed in:
  // typeof children === 'string' fails for JSX text nodes in some bundler setups,
  // so we flatten via React.Children.toArray and join to get the full string.
  let content = text ?? "";
  if (!content) {
    const childArray = React.Children.toArray(children);
    content = childArray
      .map((child) => (typeof child === "string" || typeof child === "number" ? String(child) : ""))
      .join("");
  }

  // Guard: if we still can't extract a string, render children as-is (safe fallback)
  if (!content) {
    return <p className={className}>{children}</p>;
  }

  const words = content.trim().split(/\s+/);

  return (
    <p className={className} style={{ lineHeight: 'inherit' }}>
      {words.map((word, i) => (
        <Word key={i} index={i}>
          {word}
        </Word>
      ))}
    </p>
  );
};
