const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf-8');

// Imports
const imports = `import { PulsingBorder } from './components/ui/PulsingBorder';
import { ShinyButton } from './components/ui/ShinyButton';
`;
if (!app.includes('PulsingBorder')) {
  app = app.replace("import { MyStory }", imports + "import { MyStory }");
}

// 1. Wrap hero-grid with PulsingBorder
// I will target the EXACT lines around hero-grid
app = app.replace('<div className="hero-grid">', '<PulsingBorder>\n          <div className="hero-grid">');

// I will find the end of hero-grid. It's right before `<section className="metrics"`
app = app.replace(
`            </div>
          </div>
        </div>
      </div>
    </section>

    {/*/}
    <section className="metrics"`,
`            </div>
          </div>
        </div>
        </PulsingBorder>
      </div>
    </section>

    {/*/}
    <section className="metrics"`
);

// 2. Replace ShinyButtons
app = app.replace(
  '<a href="resume/main-resume.pdf" target="_blank" className="nav-cta" id="nav-cta-btn">View Resume</a>',
  '<ShinyButton href="resume/main-resume.pdf" target="_blank" id="nav-cta-btn" className="!px-6 !py-2 !text-sm">View Resume</ShinyButton>'
);
app = app.replace(
  '<a href="resume/main-resume.pdf" target="_blank" className="nav-cta" style={{marginTop: \'16px\'}}>View Resume</a>',
  '<ShinyButton href="resume/main-resume.pdf" target="_blank" style={{marginTop: \'16px\'}}>View Resume</ShinyButton>'
);
app = app.replace(
  '<a href="#projects" className="btn-outline-green fade-up">View My Work  </a>',
  '<ShinyButton href="#projects" className="fade-up">View My Work</ShinyButton>'
);
app = app.replace(
  '<a href="mailto:gaurav.k.verma23@gmail.com" className="btn-green fade-up">Say Hello →</a>',
  '<ShinyButton href="mailto:gaurav.k.verma23@gmail.com" className="fade-up">Say Hello →</ShinyButton>'
);

fs.writeFileSync('src/App.jsx', app);

// Now refine MyStory.jsx
let story = fs.readFileSync('src/components/MyStory.jsx', 'utf-8');
const storyImports = `import { MagicText } from './ui/MagicText';
import { ShinyButton } from './ui/ShinyButton';\n`;
if (!story.includes('MagicText')) {
  story = story.replace("import './MyStory.css';", "import './MyStory.css';\n" + storyImports);
  
  story = story.replace(/<p className="story-text">([\s\S]*?)<\/p>/g, '<MagicText className="story-text">$1</MagicText>');
  
  story = story.replace(
    '<a href="#contact" className="btn-green">Let\'s build something together! →</a>',
    '<ShinyButton href="#contact" className="!w-fit mt-4">Let\'s build something together! →</ShinyButton>'
  );
  
  fs.writeFileSync('src/components/MyStory.jsx', story);
}

console.log('Integration refactoring complete.');
