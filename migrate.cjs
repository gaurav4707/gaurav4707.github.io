const fs = require('fs');

const htmlContent = fs.readFileSync('index_backup.html', 'utf-8');

// 1. Extract CSS
const styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  // fs.writeFileSync('src/index.css', styleMatch[1].trim());
  console.log('Skipped CSS overwrite');
}

// 2. Extract Body
const bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/);
let bodyContent = '';
if (bodyMatch) {
  bodyContent = bodyMatch[1];
}

// Extract Vanilla Script from Body
let vanillaJs = '';
const scriptMatch = bodyContent.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  vanillaJs = scriptMatch[1];
}

// Remove script tags from body
bodyContent = bodyContent.replace(/<script>[\s\S]*?<\/script>/gi, '');

// Basic HTML to JSX conversions
bodyContent = bodyContent.replace(/class=/g, 'className=');
bodyContent = bodyContent.replace(/for=/g, 'htmlFor=');

// Fix unclosed tags
bodyContent = bodyContent.replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />');
bodyContent = bodyContent.replace(/<hr([^>]*?)(?<!\/)>/g, '<hr$1 />');
bodyContent = bodyContent.replace(/<br([^>]*?)(?<!\/)>/g, '<br$1 />');
bodyContent = bodyContent.replace(/<input([^>]*?)(?<!\/)>/g, '<input$1 />');
bodyContent = bodyContent.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

// Convert inline styles to JSX object syntax
bodyContent = bodyContent.replace(/style="([^"]*)"/g, (match, p1) => {
  const styles = p1.split(';').filter(Boolean);
  const styleObj = styles.map(s => {
    const parts = s.split(':');
    if (parts.length < 2) return '';
    const key = parts[0].trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
    const val = parts.slice(1).join(':').trim().replace(/'/g, '"');
    return `${key}: '${val}'`;
  }).filter(Boolean).join(', ');
  return `style={{${styleObj}}}`;
});

// App.jsx template
const appJsx = `import React, { useEffect } from 'react';
import './index.css';

function App() {
  useEffect(() => {
    // Vanilla JS Extracted from index.html
    ${vanillaJs.trim().replace(/\n/g, '\n    ')}
  }, []);

  return (
    <>
${bodyContent}
    </>
  );
}

export default App;
`;

fs.writeFileSync('src/App.jsx', appJsx);
console.log('App.jsx created');
