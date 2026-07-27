import React, { Suspense, useRef, useState, useEffect } from 'react';
import './MyStory.css';
import { MagicText } from './ui/magic-text';
import { ShinyButton } from './ui/ShinyButton';


const SplineScene = React.lazy(() => import('./SplineScene'));

const SkeletonLoader = () => (
  <div className="spline-skeleton-loader"></div>
);

export const MyStory = ({ splineWrapperRef }) => {
  const containerRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  // Delay enabling the IntersectionObserver until after the anime.js
  // entry sequence has completed (~1200ms), preventing Spline from
  // competing with the animation on the main thread.
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationReady(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only attach the observer once the entry animation is done
    if (!animationReady) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [animationReady]);


  return (
    <section className="section story" id="about">
      <div className="container">
        <div className="story-grid">
          <div className="story-spline-wrap relative w-full min-h-[400px] md:min-h-[600px]" ref={(node) => {
            containerRef.current = node;
            if (splineWrapperRef) splineWrapperRef.current = node;
          }}>
            {isIntersecting ? (
              <Suspense fallback={<SkeletonLoader />}>
                <SplineScene />
              </Suspense>
            ) : (
              <SkeletonLoader />
            )}
          </div>
          <div className="story-content">
            <span className="section-tag">&lt;My Story&gt;</span>
            <h2 className="story-heading">
              My journey is fueled by a passion for technology and a commitment to delivering exceptional systems.
            </h2>
            <MagicText className="story-text">
              I'm a passionate software engineer with a strong focus on building AI-powered systems that solve real problems. With expertise in full-stack development and machine learning, I specialize in shipping production-grade platforms that are both technically rigorous and user-friendly.
            </MagicText>
            <MagicText className="story-text">
              From architecting an Agentic RAG platform at Paytm — achieving 464ms time-to-first-token with Groq — to training a 98.66%-accuracy brain tumor classifier with Grad-CAM interpretability, I've worked on diverse projects that bridge cutting-edge ML research and practical applications. At FusionHawk, I fine-tuned an EfficientNetB0 model for ocular disease classification, achieving 0.787 Macro AUC-ROC on clinical images.
            </MagicText>
            <MagicText className="story-text">
              Beyond engineering, I serve as Technical Head of NSS at JIIT Noida, leading community outreach and tutoring peers. I believe in the power of technology-driven development, collaboration, and continuous learning through competitive programming and hackathons.
            </MagicText>
            <ShinyButton href="#contact" className="!w-fit mt-4">Let's build something together! →</ShinyButton>
          </div>
        </div>
      </div>
    </section>
  );
};
