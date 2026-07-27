const fs = require('fs');

let appContent = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Add imports
const imports = `import { MyStory } from './components/MyStory';
import { useEntryAnimations } from './hooks/useEntryAnimations';
import { useRef } from 'react';
`;
appContent = appContent.replace("import './index.css';", "import './index.css';\n" + imports);

// 2. Add refs to App component
const refsSetup = `  const navRef = useRef(null);
  const heroRef = useRef(null);
  const gridRef = useRef(null);

  useEntryAnimations([navRef, heroRef, gridRef]);
`;
appContent = appContent.replace('function App() {', 'function App() {\n' + refsSetup);

// 3. Replace <section className="section story" id="about"> with <MyStory />
const storyRegex = /<section className="section story" id="about">[\s\S]*?<\/section>/;
appContent = appContent.replace(storyRegex, '<MyStory />');

// 4. Attach refs to elements
appContent = appContent.replace('<nav className="navbar">', '<nav className="navbar" ref={navRef} style={{ opacity: 0 }}>');
appContent = appContent.replace('<section className="hero">', '<section className="hero" ref={heroRef} style={{ opacity: 0 }}>');
appContent = appContent.replace('<div className="projects-grid">', '<div className="projects-grid" ref={gridRef} style={{ opacity: 0 }}>');

fs.writeFileSync('src/App.jsx', appContent);
console.log('App.jsx refined');
