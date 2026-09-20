import { useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * Hook for scroll animations - returns a ref and inView state
 * Use with motion components to trigger animations when element enters viewport
 */
export function useScrollAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  return { ref, isInView };
}

/**
 * Optimized animation variants for scroll animations - reduced complexity for better performance
 */
export const scrollAnimationVariants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 30 }, // Reduced y offset for smoother animation
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }, // Faster duration
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }, // Even faster for simple fades
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 }, // Reduced scale for smoother animation
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  },
  slideInUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  slideInDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -5 }, // Reduced rotation for smoother animation
    visible: { opacity: 1, rotate: 0, transition: { duration: 0.5, ease: "easeOut" } },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Reduced stagger delay
        delayChildren: 0.05, // Reduced initial delay
      },
    },
  },
};

export type AnimationVariant = keyof typeof scrollAnimationVariants;
