"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  scrollAnimationVariants,
  AnimationVariant,
} from "@/hooks/use-scroll-animation";

interface AnimatedElementProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  className?: string;
  [key: string]: any;
}

/**
 * Optimized animated element component - wraps children with scroll-triggered animations
 * Performance improvements: once: true to prevent re-triggering, efficient variants
 */
export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  variant = "fadeInUp",
  delay = 0,
  className = "",
  ...props
}) => {
  const variantConfig = scrollAnimationVariants[variant];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }} // once: true prevents re-triggering
      variants={{
        hidden: variantConfig.hidden,
        visible: {
          ...variantConfig.visible,
          transition: {
            duration: (variantConfig.visible.transition as any).duration || 0.6,
            delay,
            ease: "easeOut",
          },
        },
      }}
      className={className}
      style={{ willChange: "transform, opacity" }} // Optimize for GPU acceleration
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Optimized stagger container - reduced observers by using a single container
 */
interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  [key: string]: any;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className = "",
  staggerDelay = 0.2,
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -50px 0px" }} // once: true
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      className={className}
      style={{ willChange: "opacity" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Animated card - pre-configured for card elements
 */
interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  delay = 0,
  className = "",
  ...props
}) => {
  return (
    <AnimatedElement
      variant="scaleIn"
      delay={delay}
      className={`rounded-lg ${className}`}
      {...props}
    >
      {children}
    </AnimatedElement>
  );
};

/**
 * Parallax effect wrapper - adds subtle parallax on scroll
 */
interface ParallaxProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  offset = -50,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      whileInView={{ y: offset }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
