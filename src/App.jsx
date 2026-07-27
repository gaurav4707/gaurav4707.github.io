import React, { useEffect, useRef } from 'react';
import './index.css';
import { PulsingBorder } from './components/ui/PulsingBorder';
import { ShinyButton } from './components/ui/ShinyButton';
import { MyStory } from './components/MyStory';
import { useGlobalEntryAnimation } from './hooks/useGlobalEntryAnimation';


function App() {
  const navRef = useRef(null);
  const heroTextRef = useRef(null);
  const splineWrapperRef = useRef(null);
  const skillsRef = useRef(null);
  const projectCardsRef = useRef(null);

  useGlobalEntryAnimation({ navRef, heroTextRef, splineWrapperRef, projectCardsRef, skillsRef });

  useEffect(() => {
    // Vanilla JS Extracted from index.html
    // ---- Staggered Scroll Reveal System ----
    // Assigns incremental transition-delay to sibling animated elements
    // within the same parent, creating a smooth staggered entrance.
    function applyStaggerDelays() {
      const groups = new Map();
      document.querySelectorAll('.fade-up, .fade-left, .fade-right, .fade-scale').forEach(el => {
        const parent = el.parentElement;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(el);
      });

      groups.forEach(children => {
        if (children.length > 1) {
          children.forEach((child, i) => {
            // 70ms stagger between siblings — fast enough to feel snappy,
            // slow enough for the eye to track the cascade
            child.style.transitionDelay = `${i * 0.07}s`;
          });
        }
      });
    }

    applyStaggerDelays();

    // ---- Scroll Fade-In Animations ----
    const fadeEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .fade-scale');
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    fadeEls.forEach(el => fadeObserver.observe(el));

    // ---- Counter Animation ----
    const counterEls = document.querySelectorAll('.metric-value[data-target]');
    let countersDone = false;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersDone) {
          countersDone = true;
          animateCounters();
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    counterEls.forEach(el => counterObserver.observe(el));

    function animateCounters() {
      counterEls.forEach(el => {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 1500;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
      });
    }

    // ---- Hamburger Menu ----
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // ---- Smooth active nav highlight ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.style.color = 'var(--green)';
            }
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' });

    sections.forEach(s => navObserver.observe(s));

    // ---- Project filter (decorative) ----
    const filterBtns = document.querySelectorAll('.project-filter');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }, []);

  return (
    <>


      {/* ============================================
       NAVIGATION
       ============================================ */}
      <nav className="nav" role="navigation" aria-label="Main navigation" ref={navRef}>
        <div className="container">
          <a href="#" className="nav-logo"><span>//</span> GKV</a>

          <ul className="nav-links">
            <li><a href="#about">My Story</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#certifications">Certifications</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          <ShinyButton href="resume/main-resume.pdf" target="_blank" id="nav-cta-btn" className="!px-6 !py-2 !text-sm">View Resume</ShinyButton>

          <button className="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className="mobile-menu" id="mobile-menu" role="dialog" aria-label="Mobile navigation">
        <a href="#about" className="mobile-nav-link">My Story</a>
        <a href="#experience" className="mobile-nav-link">Experience</a>
        <a href="#skills" className="mobile-nav-link">Skills</a>
        <a href="#projects" className="mobile-nav-link">Projects</a>
        <a href="#education" className="mobile-nav-link">Education</a>
        <a href="#certifications" className="mobile-nav-link">Certifications</a>
        <a href="#contact" className="mobile-nav-link">Contact</a>
        <ShinyButton href="resume/main-resume.pdf" target="_blank" style={{ marginTop: '16px' }}>View Resume</ShinyButton>
      </div>

      <main>
        {/* ============================================
         HERO
         ============================================ */}
        <section className="hero section" id="hero">
          <div className="container">
            <PulsingBorder>
              <div className="hero-grid">
                <div className="hero-content" ref={heroTextRef}>
                  <span className="hero-tag fade-up">&lt;2+ Year Experience&gt;</span>

                  <h1 className="hero-heading fade-up">Building Fast, Scalable, and Intelligent Systems</h1>

                  <div className="hero-social fade-up">
                    <a href="https://www.linkedin.com/in/gaurav-k-222196344/" target="_blank" rel="noopener">LinkedIn</a>
                    <a href="https://github.com/gaurav4707" target="_blank" rel="noopener">GitHub</a>
                    <a href="mailto:gaurav.k.verma23@gmail.com">Email</a>
                  </div>

                  <span className="hero-about-label fade-up">&lt;About&gt;</span>
                  <p className="hero-about-text fade-up">I'm a full-stack and AI/ML engineer who ships production systems
                    end-to-end — from schema design to deployed frontend. Currently building AI-powered platforms with a focus
                    on precision, privacy, and real-world impact.</p>
                </div>

                <div className="hero-portrait fade-up">
                  <div className="portrait-frame">
                    {/* Replace this div with: <img src="portrait.jpg" alt="Gaurav Kumar Verma portrait" /> */}
                    <img src="portrait.png" alt="Gaurav Kumar Verma portrait" />
                  </div>
                  <p className="portrait-name"><span>//</span> Gaurav Kumar Verma</p>
                </div>
              </div>
            </PulsingBorder>
          </div>
        </section>

        {/* ============================================
         METRICS BAR
         ============================================ */}
        <section className="metrics" aria-label="Key achievements">
          <div className="container">
            <p className="section-tag fade-up">&lt;Success &amp; Achievements&gt;</p>
            <div className="metrics-bar fade-up stagger-children">
              <div className="metric-item fade-up">
                <div className="metric-value" data-target="8" data-suffix="+">0</div>
                <div className="metric-label">Completed Projects</div>
              </div>
              <div className="metric-item fade-up">
                <div className="metric-value" data-target="2" data-suffix="+">0</div>
                <div className="metric-label">Years in Development</div>
              </div>
              <div className="metric-item fade-up">
                <div className="metric-value" data-target="3" data-suffix="+">0</div>
                <div className="metric-label">Hackathon Awards</div>
              </div>
              <div className="metric-item fade-up">
                <div className="metric-value" data-target="25" data-suffix="K+">0</div>
                <div className="metric-label">Data Points Processed</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
         MY STORY (About)
         ============================================ */}
        <MyStory splineWrapperRef={splineWrapperRef} />

        {/* ============================================
         WORK EXPERIENCE
         ============================================ */}
        <section className="section experience" id="experience">
          <div className="container">
            <span className="section-tag fade-up">&lt;Work Experience&gt;</span>
            <h2 className="section-heading fade-up">Where I've Built &amp; Shipped</h2>

            <div className="timeline">
              {/* Paytm Payment Services Limited */}
              <div className="timeline-item fade-up">
                <div className="timeline-node"></div>
                <div className="timeline-card">
                  <div className="timeline-header">
                    <div>
                      <h3 className="timeline-role">Intern — AI / RAG Platform Engineer</h3>
                      <div className="timeline-company">Paytm Payment Services Limited <span>· Noida, India</span></div>
                    </div>
                    <span className="timeline-date">18/06/2026 – 24/07/2026</span>
                  </div>
                  <ul className="timeline-bullets">
                    <li>Architected a modular, provider-agnostic <strong>Advanced Agentic RAG</strong> platform using
                      <strong>FastAPI, LangChain, React</strong>, and <strong>ChromaDB</strong>, implementing deterministic
                      tool routing, hybrid retrieval (Dense + BM25 + RRF), cross-encoder reranking, query rewriting, and
                      document summarization for PDF knowledge bases up to 2,500 pages.
                    </li>
                    <li>Optimized LLM inference with <strong>Groq API</strong> and Server-Sent Events (SSE), achieving
                      <strong>464.5 ms TTFT</strong> and <strong>748.2 ms average response latency</strong> while generating
                      grounded, citation-backed responses.
                    </li>
                    <li>Engineered a production-style architecture using Strategy, Factory, and Registry patterns with
                      pluggable AI providers, alongside an offline retrieval evaluation framework and <strong>400+ automated
                        tests (69.93% coverage)</strong> to validate retrieval quality and system reliability.</li>
                  </ul>
                  <div className="timeline-tech">
                    <span>FastAPI</span>
                    <span>LangChain</span>
                    <span>ChromaDB</span>
                    <span>Groq API</span>
                    <span>SSE</span>
                    <span>Python</span>
                    <span>Testing</span>
                  </div>
                </div>
              </div>

              {/* FusionHawk */}
              <div className="timeline-item fade-up">
                <div className="timeline-node"></div>
                <div className="timeline-card">
                  <div className="timeline-header">
                    <div>
                      <h3 className="timeline-role">Software Developer Intern</h3>
                      <div className="timeline-company">FusionHawk <span>· Remote</span></div>
                    </div>
                    <span className="timeline-date">02/06/2026 – 18/06/2026</span>
                  </div>
                  <ul className="timeline-bullets">
                    <li>Built an AI-assisted anterior segment ocular disease classifier by fine-tuning an
                      <strong>EfficientNetB0</strong> backbone on a curated dataset of 319 clinical images, achieving a
                      <strong>0.787 Macro AUC-ROC score</strong>.
                    </li>
                    <li>Implemented anti-overfitting techniques — <strong>label smoothing, MixUp augmentation, and 5-fold
                      cross-validation</strong> — to maximize diagnostic reliability on rare ocular surface conditions.
                    </li>
                    <li>Packaged and deployed the inference model via a multi-screen <strong>Streamlit application</strong>
                      within a 3.57GB <strong>Docker container</strong>, featuring real-time <strong>Grad-CAM
                        explainability</strong> and condition-specific warning banners.</li>
                  </ul>
                  <div className="timeline-tech">
                    <span>EfficientNetB0</span>
                    <span>PyTorch</span>
                    <span>Grad-CAM</span>
                    <span>Docker</span>
                    <span>Streamlit</span>
                    <span>Computer Vision</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
         SUCCESS / EXPERIENCE QUOTE
         ============================================ */}
        <section className="section success">
          <div className="container">
            <div className="success-grid">
              <div className="success-content">
                <span className="section-tag fade-up">&lt;2+ Year Experience&gt;</span>
                <h2 className="success-quote fade-up">My work has been defined by its technical precision, system reliability,
                  and impact on real&#8209;world applications.</h2>
                <ShinyButton href="#projects" className="fade-up">View My Work →</ShinyButton>
              </div>

              <div className="success-portrait-area fade-up">
                <div className="success-img">
                  <img src="portrait.png" alt="Gaurav Kumar Verma" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <p className="success-name"><span>//</span> Gaurav Kumar Verma</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
         SKILLS & TECHNOLOGIES
         ============================================ */}
        <section className="section skills" id="skills">
          <div className="container">
            <div className="skills-layout">
              <div className="skills-header fade-up">
                <h2>Skills and<br />Technologies</h2>
              </div>

              <div className="skills-categories" ref={skillsRef}>
                {/* PROGRAMMING LANGUAGES */}
                <div className="skill-category fade-up">
                  <h3>&lt;Programming Languages&gt;</h3>
                  <div className="skill-badges">
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" alt="C"
                        loading="lazy" />
                      <span>C</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg"
                        alt="C++" loading="lazy" />
                      <span>C++</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg"
                        alt="Python" loading="lazy" />
                      <span>Python</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" alt="Java"
                        loading="lazy" />
                      <span>Java</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg"
                        alt="HTML" loading="lazy" />
                      <span>HTML</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" alt="CSS"
                        loading="lazy" />
                      <span>CSS</span>
                    </div>
                    <div className="skill-badge">
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"
                        alt="JavaScript" loading="lazy" />
                      <span>JavaScript</span>
                    </div>
                    <div className="skill-badge">
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg"
                        alt="TypeScript" loading="lazy" />
                      <span>TypeScript</span>
                    </div>
                    <div className="skill-badge">
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg"
                        alt="SQL" loading="lazy" />
                      <span>SQL</span>
                    </div>
                  </div>
                </div>

                {/* FRONTEND DEVELOPER */}
                <div className="skill-category fade-up">
                  <h3>&lt;Frontend&gt;</h3>
                  <div className="skill-badges">
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
                        alt="React.js" loading="lazy" />
                      <span>React.js</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-plain.svg"
                        alt="Vite" loading="lazy" />
                      <span>Vite</span>
                    </div>
                    <div className="skill-badge">
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg"
                        alt="Tailwind CSS" loading="lazy" />
                      <span>Tailwind CSS</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:layout-template.svg?color=%234ade80"
                        alt="Responsive Web Design" loading="lazy" />
                      <span>Responsive Web Design</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg"
                        alt="Next.js" className="icon-invert" loading="lazy" />
                      <span>Next.js</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg"
                        alt="Figma" loading="lazy" />
                      <span>Figma</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/canva/canva-original.svg"
                        alt="Canva" loading="lazy" />
                      <span>Canva</span>
                    </div>
                  </div>
                </div>

                {/* BACKEND DEVELOPER */}
                <div className="skill-category fade-up">
                  <h3>&lt;Backend&gt;</h3>
                  <div className="skill-badges">
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg"
                        alt="FastAPI" loading="lazy" />
                      <span>FastAPI</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:webhook.svg?color=%234ade80" alt="REST APIs"
                        loading="lazy" />
                      <span>REST APIs</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg"
                        alt="Node.js" loading="lazy" />
                      <span>Node.js</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg"
                        alt="Firebase" loading="lazy" />
                      <span>Firebase</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg"
                        alt="Supabase" loading="lazy" />
                      <span>Supabase</span>
                    </div>
                    <div className="skill-badge">
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg"
                        alt="RDBMS" loading="lazy" />
                      <span>RDBMS</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:shield-check.svg?color=%234ade80"
                        alt="Authentication &amp; Authorization" loading="lazy" />
                      <span>Authentication &amp; Authorization</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg" alt="Testing"
                        loading="lazy" />
                      <span>Testing</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg"
                        alt="Containerization" loading="lazy" />
                      <span>Containerization</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg"
                        alt="NoSQL" loading="lazy" />
                      <span>NoSQL</span>
                    </div>
                  </div>
                </div>

                {/* CS FUNDAMENTALS */}
                <div className="skill-category fade-up">
                  <h3>&lt;CS&gt;</h3>
                  <div className="skill-badges">
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:binary.svg?color=%234ade80"
                        alt="Data Structures &amp; Algorithms" loading="lazy" />
                      <span>Data Structures &amp; Algorithms</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:boxes.svg?color=%234ade80" alt="OOPs" loading="lazy" />
                      <span>OOPs</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:workflow.svg?color=%234ade80" alt="System Design"
                        loading="lazy" />
                      <span>System Design</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg"
                        alt="DBMS" loading="lazy" />
                      <span>DBMS</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:network.svg?color=%234ade80" alt="Computer Networks"
                        loading="lazy" />
                      <span>Computer Networks</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" alt="OS"
                        loading="lazy" />
                      <span>OS</span>
                    </div>
                  </div>
                </div>

                {/* AI/ML ENGINEERING */}
                <div className="skill-category fade-up">
                  <h3>&lt;AI/ML&gt;</h3>
                  <div className="skill-badges">
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:gauge.svg?color=%234ade80" alt="Model Evaluation"
                        loading="lazy" />
                      <span>Model Evaluation</span>
                    </div>
                    <div className="skill-badge">
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg"
                        alt="Scikit-learn" loading="lazy" />
                      <span>Scikit-learn</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg"
                        alt="PyTorch" loading="lazy" />
                      <span>PyTorch</span>
                    </div>
                    <div className="skill-badge">
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg"
                        alt="TensorFlow" loading="lazy" />
                      <span>TensorFlow</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/simple-icons:ollama.svg?color=%234ade80" alt="Ollama"
                        loading="lazy" />
                      <span>Ollama</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:brain-circuit.svg?color=%234ade80" alt="Model Design"
                        loading="lazy" />
                      <span>Model Design</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:message-square-code.svg?color=%234ade80" alt="NLP"
                        loading="lazy" />
                      <span>NLP</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:sliders.svg?color=%234ade80" alt="Hyperparameter Tuning"
                        loading="lazy" />
                      <span>Hyperparameter Tuning</span>
                    </div>
                  </div>
                </div>

                {/* LLM ENGINEERING */}
                <div className="skill-category fade-up">
                  <h3>&lt;LLM&gt;</h3>
                  <div className="skill-badges">
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/simple-icons:langchain.svg?color=%234ade80"
                        alt="Langchain &amp; Langgraph" loading="lazy" />
                      <span>Langchain &amp; Langgraph</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:terminal-square.svg?color=%234ade80"
                        alt="Prompt &amp; Context Engineering" loading="lazy" />
                      <span>Prompt &amp; Context Engineering</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:layers-3.svg?color=%234ade80" alt="Vector Databases"
                        loading="lazy" />
                      <span>Vector Databases</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:grid.svg?color=%234ade80" alt="Vector Embeddings"
                        loading="lazy" />
                      <span>Vector Embeddings</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:file-search-2.svg?color=%234ade80"
                        alt="Retrieval-Augmented Generation (RAG)" loading="lazy" />
                      <span>Retrieval-Augmented Generation (RAG)</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:bot.svg?color=%234ade80"
                        alt="AI Agents &amp; Orchestration" loading="lazy" />
                      <span>AI Agents &amp; Orchestration</span>
                    </div>
                  </div>
                </div>

                {/* DATA ANALYTICS */}
                <div className="skill-category fade-up">
                  <h3>&lt;Data Analytics&gt;</h3>
                  <div className="skill-badges">
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg"
                        alt="NumPy" loading="lazy" />
                      <span>Numpy</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg"
                        alt="Pandas" loading="lazy" />
                      <span>Pandas</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:trending-up.svg?color=%234ade80"
                        alt="Time-series Forecasting" loading="lazy" />
                      <span>Time-series Forecasting</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:pie-chart.svg?color=%234ade80" alt="Data Visualization"
                        loading="lazy" />
                      <span>Data Visualization</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:filter.svg?color=%234ade80" alt="Data Cleaning"
                        loading="lazy" />
                      <span>Data Cleaning</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/lucide:activity.svg?color=%234ade80" alt="Statistics"
                        loading="lazy" />
                      <span>Statistics</span>
                    </div>
                  </div>
                </div>

                {/* TOOLS & PLATFORMS */}
                <div className="skill-category fade-up">
                  <h3>&lt;Tools &amp; Platforms&gt;</h3>
                  <div className="skill-badges">
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg"
                        alt="Shell" loading="lazy" />
                      <span>Shell</span>
                    </div>
                    <div className="skill-badge">
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg"
                        alt="AWS" className="icon-invert" loading="lazy" />
                      <span>Amazon Web Services (AWS)</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" alt="Git"
                        loading="lazy" />
                      <span>Git</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg"
                        alt="Github" className="icon-invert" loading="lazy" />
                      <span>Github</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg"
                        alt="Vercel" className="icon-invert" loading="lazy" />
                      <span>Vercel</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/simple-icons:railway.svg?color=%234ade80" alt="Railway"
                        loading="lazy" />
                      <span>Railway</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://api.iconify.design/simple-icons:render.svg?color=%234ade80" alt="Render"
                        loading="lazy" />
                      <span>Render</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg"
                        alt="Docker" loading="lazy" />
                      <span>Docker</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg"
                        alt="VS Code" loading="lazy" />
                      <span>VS Code</span>
                    </div>
                    <div className="skill-badge">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/anaconda/anaconda-original.svg"
                        alt="Anaconda" loading="lazy" />
                      <span>Anaconda</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
         PROJECTS SHOWCASE
         ============================================ */}
        <section className="section projects" id="projects">
          <div className="container">
            <div className="projects-header">
              <div>
                <span className="section-tag fade-up">&lt;Explore My Work&gt;</span>
                <h2 className="fade-up">A Showcase of My<br />Latest Projects</h2>
              </div>
              <div className="project-filters fade-up">
                <button className="project-filter active">All</button>
                <button className="project-filter">2026</button>
                <button className="project-filter">2025</button>
              </div>
            </div>

            <div className="projects-grid" ref={projectCardsRef}>
              {/* NeuroVision AI (Featured) */}
              <article className="project-card featured fade-up">
                <div className="project-thumb thumb-neurovision">
                  <div className="project-thumb-overlay">
                    <h3 className="project-thumb-name">NeuroVision AI</h3>
                  </div>
                </div>
                <div className="project-body">
                  <div className="project-tech">
                    <span>PyTorch</span>
                    <span>EfficientNetV2-S</span>
                    <span>Grad-CAM</span>
                    <span>Streamlit</span>
                  </div>
                  <p className="project-desc">Engineered a production-grade 4-class brain tumor classification system trained on
                    15,415 MRI scans. Deployed a clinical-decision support web app delivering real-time predictions,
                    confidence scores, and custom Grad-CAM explainability heatmaps for tumor localization. Secured a Top 5
                    finish at the CODEAI Hackathon 2026.</p>
                  <div className="project-metric">⚡ 98.66% Accuracy · 5-Fold Cross-Validation · Mixed Precision Training</div>
                  <div className="project-links">
                    <a href="https://github.com/gaurav4707/Eye-Disease-Classification" target="_blank" rel="noopener" className="project-link">GitHub</a>
                  </div>
                </div>
              </article>

              {/* ATLAS */}
              <article className="project-card fade-up">
                <div className="project-thumb thumb-atlas">
                  <div className="project-thumb-overlay">
                    <h3 className="project-thumb-name">ATLAS</h3>
                  </div>
                </div>
                <div className="project-body">
                  <div className="project-tech">
                    <span>Python</span>
                    <span>Ollama</span>
                    <span>NLP</span>
                    <span>Desktop APIs</span>
                  </div>
                  <p className="project-desc">Privacy-first, offline desktop AI assistant constrained to a 6GB VRAM environment.
                    Routes 25–35 daily voice commands using faster-whisper STT and dynamically selected Ollama models with a
                    VRAM-tiering strategy to mitigate OOM risk.</p>
                  <div className="project-metric">⚡ 2,029ms Latency Reduction via Regex Pre-Classifier Gate</div>
                  <div className="project-links">
                    <a href="https://github.com/gaurav4707/A.T.L.A.S" target="_blank" rel="noopener" className="project-link">GitHub</a>
                  </div>
                </div>
              </article>

              {/* HealthSync */}
              <article className="project-card fade-up">
                <div className="project-thumb thumb-healthsync">
                  <div className="project-thumb-overlay">
                    <h3 className="project-thumb-name">HealthSync</h3>
                  </div>
                </div>
                <div className="project-body">
                  <div className="project-tech">
                    <span>React</span>
                    <span>Vite</span>
                    <span>Tailwind</span>
                    <span>Tesseract.js</span>
                    <span>Gemini API</span>
                  </div>
                  <p className="project-desc">Full-stack post-discharge healthcare platform connecting hospitals and patients.
                    Won Certificate of Excellence at Hackoverflow 9.0. Integrated AI-powered OCR for digitizing medical
                    prescriptions and LLM workflows for predictive emergency alerts.</p>
                  <div className="project-metric">⚡ 10.58s Avg. OCR Processing · Predictive Emergency Alerts</div>
                  <div className="project-links">
                    <a href="https://healthsync-six.vercel.app/" target="_blank" rel="noopener"
                      className="project-link primary">Live View</a>
                    <a href="https://github.com/gaurav4707" target="_blank" rel="noopener" className="project-link">GitHub</a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ============================================
         EDUCATION & VOLUNTEER EXPERIENCE
         ============================================ */}
        <section className="section edu-vol" id="education">
          <div className="container">
            <span className="section-tag fade-up">&lt;Academic &amp; Leadership&gt;</span>
            <h2 className="section-heading fade-up">Education &amp; Community Impact</h2>

            <div className="edu-vol-grid">
              {/* EDUCATION CARD */}
              <div className="edu-card fade-up">
                <div className="edu-card-header">
                  <div>
                    <h3 className="edu-title">Bachelor of Technology — BTech</h3>
                    <div className="edu-institution">Jaypee Institute of Information Technology</div>
                    <div className="edu-meta">Computer Science and Engineering · Noida, India</div>
                  </div>
                  <div className="edu-grade">7.78 CGPA</div>
                </div>
                <div className="timeline-date" style={{ alignSelf: 'flex-start', marginBottom: '12px' }}>2024 – 2028</div>
                <div className="edu-achievement">
                  🏆 <strong>Competitive Programming Highlight:</strong> Achieved <strong>5th place in CodeClash</strong>, a
                  campus-wide competitive programming contest conducted on HackerRank.
                </div>

                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px dashed var(--border)' }}>
                  <div className="edu-card-header" style={{ marginBottom: '8px' }}>
                    <div>
                      <h4 className="edu-title" style={{ fontSize: '1.05rem' }}>Higher Secondary School</h4>
                      <div className="edu-institution" style={{ fontSize: '0.875rem' }}>St. Joseph's Convent School</div>
                      <div className="edu-meta">Non Medical · Faridabad, India</div>
                    </div>
                    <div className="edu-grade">94%</div>
                  </div>
                  <div className="timeline-date" style={{ alignSelf: 'flex-start' }}>2009 – 2024</div>
                </div>
              </div>

              {/* VOLUNTEER CARD */}
              <div className="volunteer-card fade-up" id="volunteer">
                <div className="volunteer-card-header">
                  <div>
                    <h3 className="volunteer-title">Technical Head — NSS</h3>
                    <div className="volunteer-org">National Service Scheme (NSS), JIIT Noida</div>
                    <div className="volunteer-meta">Noida, India</div>
                  </div>
                  <span className="timeline-date">10/2025 – Present</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Leading technical operations and community outreach initiatives driving social awareness and technology
                  literacy.
                </p>
                <ul className="volunteer-list">
                  <li>Led technical operations for community outreach events promoting environmental and social awareness.
                  </li>
                  <li>Tutored peers in technical subjects; produced informational content for community distribution.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
         CERTIFICATIONS
         ============================================ */}
        <section className="section certifications" id="certifications">
          <div className="container">
            <span className="section-tag fade-up">&lt;Verified Credentials&gt;</span>
            <h2 className="section-heading fade-up">Certifications &amp; Achievements</h2>

            <div className="cert-grid">
              {/* Cert 1 */}
              <div className="cert-card fade-up">
                <div className="cert-top">
                  <div className="cert-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 15l-2 5l9-9l-9-9l2 5l-7 4z" />
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="cert-badge-tag">Cloud &amp; AI</span>
                    <div className="cert-issuer">Oracle Cloud</div>
                  </div>
                </div>
                <h3 className="cert-title">Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate</h3>
              </div>

              {/* Cert 2 */}
              <div className="cert-card fade-up">
                <div className="cert-top">
                  <div className="cert-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                      <line x1="12" y1="20" x2="12.01" y2="20" />
                    </svg>
                  </div>
                  <div>
                    <span className="cert-badge-tag">Networking</span>
                    <div className="cert-issuer">Cisco Networking Academy</div>
                  </div>
                </div>
                <h3 className="cert-title">Cisco Certified Networking Basics</h3>
              </div>

              {/* Cert 3 */}
              <div className="cert-card fade-up">
                <div className="cert-top">
                  <div className="cert-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <div>
                    <span className="cert-badge-tag">Data Analytics</span>
                    <div className="cert-issuer">Deloitte / Forage</div>
                  </div>
                </div>
                <h3 className="cert-title">Deloitte Data Analytics Job Simulation</h3>
              </div>

              {/* Cert 4 */}
              <div className="cert-card fade-up">
                <div className="cert-top">
                  <div className="cert-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="7" />
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                    </svg>
                  </div>
                  <div>
                    <span className="cert-badge-tag">Hackathon Honor</span>
                    <div className="cert-issuer">Hackoverflow 9.0</div>
                  </div>
                </div>
                <h3 className="cert-title">Certificate of Excellence in Hackoverflow 9.0</h3>
              </div>

              {/* Cert 5 */}
              <div className="cert-card fade-up">
                <div className="cert-top">
                  <div className="cert-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="cert-badge-tag">Hackathon Honor</span>
                    <div className="cert-issuer">Paranox 2.0</div>
                  </div>
                </div>
                <h3 className="cert-title">Certificate of Appreciation in Paranox 2.0</h3>
              </div>

              {/* Cert 6 */}
              <div className="cert-card fade-up">
                <div className="cert-top">
                  <div className="cert-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div>
                    <span className="cert-badge-tag">Hackathon Honor</span>
                    <div className="cert-issuer">HackVision</div>
                  </div>
                </div>
                <h3 className="cert-title">Certificate of Appreciation in HackVision</h3>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
         CONTACT / LET'S STAY CONNECTED
         ============================================ */}
        <section className="contact" id="contact">
          <div className="container">
            <div className="contact-cta fade-up">
              <h2>Let's Stay Connected</h2>
              <p>I'm seeking Software Engineering and AI/ML roles where I can apply technical rigour to high-impact
                problems. Let's talk.</p>
              <div className="contact-cta-links" style={{ gap: '16px', display: 'flex', flexWrap: 'wrap' }}>
                <ShinyButton href="mailto:gaurav.k.verma23@gmail.com" className="!text-sm">gaurav.k.verma23@gmail.com</ShinyButton>
                <ShinyButton href="https://www.linkedin.com/in/gaurav-k-222196344/" target="_blank" rel="noopener" className="!text-sm">LinkedIn</ShinyButton>
                <ShinyButton href="https://github.com/gaurav4707" target="_blank" rel="noopener" className="!text-sm">GitHub</ShinyButton>
              </div>
            </div>

            <div className="contact-social fade-up">
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/gaurav-k-222196344/" target="_blank" rel="noopener"
                className="contact-social-link" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* GitHub */}
              <a href="https://github.com/gaurav4707" target="_blank" rel="noopener" className="contact-social-link"
                aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
              {/* Email */}
              <a href="mailto:gaurav.k.verma23@gmail.com" className="contact-social-link" aria-label="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================
       FOOTER
       ============================================ */}
      <footer className="footer">
        <div className="container">
          <span className="footer-text">© 2026 Gaurav Kumar Verma</span>
          <span className="footer-right">Software Engineer · AI/ML & LLM Engineer</span>
        </div>
      </footer>

      {/* ============================================
       JAVASCRIPT
       ============================================ */}



    </>
  );
}

export default App;
