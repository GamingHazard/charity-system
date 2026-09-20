import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface UseCounterAnimationProps {
  end: number;
  duration?: number;
  decimals?: number;
  delay?: number;
}

export function useCounterAnimation({
  end,
  duration = 2000,
  decimals = 0,
  delay = 0,
}: UseCounterAnimationProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;

    hasAnimated.current = true;

    const startAnimation = () => {
      let startTime: number | null = null;
      let animationFrameId: number;

      const animate = (currentTime: number) => {
        if (startTime === null) {
          startTime = currentTime;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuad = (t: number) => t * (2 - t);
        const easedProgress = easeOutQuad(progress);

        const currentCount = Math.floor(end * easedProgress);
        setCount(currentCount);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    };

    if (delay > 0) {
      const timeoutId = setTimeout(startAnimation, delay);
      return () => clearTimeout(timeoutId);
    } else {
      startAnimation();
    }
  }, [isInView, end, duration, delay]);

  return { count, ref };
}
