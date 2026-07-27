import React from 'react';
import './ShinyButton.css';

export const ShinyButton = ({ children, href, className = '', ...props }) => {
  const commonClasses = `shiny-cta ${className}`;
  
  const content = <span>{children}</span>;

  if (href) {
    return (
      <a href={href} className={commonClasses} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={commonClasses} {...props}>
      {content}
    </button>
  );
};
