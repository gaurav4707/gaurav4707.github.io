import { useEffect } from 'react';
import anime from 'animejs';

export const useEntryAnimations = (targets, trigger = true) => {
  useEffect(() => {
    if (!trigger) return;

    const domNodes = targets.map((ref) => ref.current).filter(Boolean);
    if (domNodes.length === 0) return;

    anime({
      targets: domNodes,
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutExpo',
      delay: anime.stagger(100),
    });
  }, [targets, trigger]);
};
