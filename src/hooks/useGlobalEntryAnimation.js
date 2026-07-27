import { useEffect } from 'react';
import anime from 'animejs';

export const useGlobalEntryAnimation = (refs) => {
  useEffect(() => {
    const { navRef, heroTextRef, splineWrapperRef, projectCardsRef, skillsRef } = refs;

    // Set initial states to prevent flashing
    if (navRef?.current) {
      anime.set(navRef.current, { opacity: 0, translateY: 30 });
    }
    if (heroTextRef?.current) {
      anime.set(heroTextRef.current.children, { opacity: 0, translateY: 30 });
    }
    if (splineWrapperRef?.current) {
      anime.set(splineWrapperRef.current, { opacity: 0 });
    }
    if (skillsRef?.current) {
      anime.set(skillsRef.current.children, { opacity: 0, translateY: 30 });
    }
    if (projectCardsRef?.current) {
      anime.set(projectCardsRef.current.children, { opacity: 0, translateY: 30 });
    }

    // Step 1 & 2: Timeline for immediately visible elements
    const tl = anime.timeline({
      easing: 'easeOutExpo',
    });

    if (navRef?.current) {
      tl.add({
        targets: navRef.current,
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 800,
      });
    }

    if (heroTextRef?.current) {
      tl.add({
        targets: heroTextRef.current.children,
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(150),
      }, '-=600'); // Overlap with nav animation
    }

    if (splineWrapperRef?.current) {
      tl.add({
        targets: splineWrapperRef.current,
        opacity: [0, 1],
        duration: 1000,
        easing: 'linear',
      }, '-=400'); // Fade in smoothly right as text resolves
    }

    // Step 3: Scroll-triggered cascading stagger for grids
    const animateGrid = (element) => {
      if (!element) return;
      anime({
        targets: element.children,
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo',
        delay: anime.stagger(100)
      });
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateGrid(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    if (skillsRef?.current) observer.observe(skillsRef.current);
    if (projectCardsRef?.current) observer.observe(projectCardsRef.current);

    return () => {
      observer.disconnect();
    };
  }, []); // Run strictly once on mount
};
