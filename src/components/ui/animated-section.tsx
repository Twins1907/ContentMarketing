"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  type Variants,
} from "framer-motion";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  AnimatedSection – scroll-reveal wrapper (fade-in + slide up)      */
/* ------------------------------------------------------------------ */

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function AnimatedSection({
  children,
  className,
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  StaggeredContainer – parent wrapper for staggered children        */
/* ------------------------------------------------------------------ */

interface StaggeredContainerProps {
  children: React.ReactNode;
  className?: string;
}

const staggeredContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function StaggeredContainer({ children, className }: StaggeredContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggeredContainerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  StaggeredItem – child of StaggeredContainer                       */
/* ------------------------------------------------------------------ */

interface StaggeredItemProps {
  children: React.ReactNode;
  className?: string;
}

const staggeredItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

function StaggeredItem({ children, className }: StaggeredItemProps) {
  return (
    <motion.div variants={staggeredItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  AnimatedCounter – number counter that animates when in view       */
/* ------------------------------------------------------------------ */

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1500; // ms
    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    }

    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  FloatingElement – gentle floating / bobbing animation             */
/* ------------------------------------------------------------------ */

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

function FloatingElement({
  children,
  className,
  amplitude = 8,
  duration = 3,
}: FloatingElementProps) {
  return (
    <motion.div
      animate={{ y: [0, -amplitude, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  FloatingShape – geometric shapes that float and rotate            */
/* ------------------------------------------------------------------ */

interface FloatingShapeProps {
  shape: "circle" | "square" | "diamond" | "triangle" | "ring" | "dot";
  color: string;
  size?: number;
  className?: string;
  delay?: number;
  duration?: number;
  amplitude?: number;
  rotate?: number;
}

function FloatingShape({
  shape,
  color,
  size = 40,
  className,
  delay = 0,
  duration = 6,
  amplitude = 15,
  rotate = 360,
}: FloatingShapeProps) {
  const shapeStyles: Record<string, React.CSSProperties> = {
    circle: {
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: color,
    },
    square: {
      width: size,
      height: size,
      borderRadius: size * 0.15,
      backgroundColor: color,
    },
    diamond: {
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: size * 0.1,
    },
    triangle: {
      width: 0,
      height: 0,
      borderLeft: `${size / 2}px solid transparent`,
      borderRight: `${size / 2}px solid transparent`,
      borderBottom: `${size}px solid ${color}`,
      backgroundColor: "transparent",
    },
    ring: {
      width: size,
      height: size,
      borderRadius: "50%",
      border: `${Math.max(2, size * 0.12)}px solid ${color}`,
      backgroundColor: "transparent",
    },
    dot: {
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: color,
    },
  };

  return (
    <motion.div
      className={cn("absolute pointer-events-none", className)}
      style={shapeStyles[shape]}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.7, 0.5, 0.7, 0],
        scale: [0.5, 1, 0.9, 1, 0.5],
        y: [0, -amplitude, amplitude * 0.5, -amplitude * 0.7, 0],
        x: [0, amplitude * 0.3, -amplitude * 0.5, amplitude * 0.2, 0],
        rotate: shape === "diamond" ? [45, 45 + rotate * 0.5] : [0, rotate],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  GradientOrb – large animated gradient blob                        */
/* ------------------------------------------------------------------ */

interface GradientOrbProps {
  colors: [string, string];
  size?: number;
  className?: string;
  duration?: number;
  delay?: number;
}

function GradientOrb({
  colors,
  size = 300,
  className,
  duration = 8,
  delay = 0,
}: GradientOrbProps) {
  return (
    <motion.div
      className={cn("absolute rounded-full pointer-events-none blur-3xl", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${colors[0]} 0%, ${colors[1]} 70%, transparent 100%)`,
      }}
      animate={{
        scale: [1, 1.2, 0.9, 1.1, 1],
        opacity: [0.3, 0.5, 0.25, 0.45, 0.3],
        x: [0, 30, -20, 15, 0],
        y: [0, -20, 15, -10, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  SparkleField – randomly placed animated sparkles                  */
/* ------------------------------------------------------------------ */

interface SparkleFieldProps {
  count?: number;
  className?: string;
  colors?: string[];
}

function SparkleField({
  count = 12,
  className,
  colors = ["#FFFFFF", "#C9A7EB", "#89CFF0", "#F5C542"],
}: SparkleFieldProps) {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: `${5 + Math.random() * 90}%`,
    y: `${5 + Math.random() * 90}%`,
    size: 2 + Math.random() * 4,
    color: colors[i % colors.length],
    delay: Math.random() * 3,
    duration: 1.5 + Math.random() * 2,
  }));

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  WordReveal – text that reveals word by word                       */
/* ------------------------------------------------------------------ */

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

function WordReveal({
  text,
  className,
  delay = 0,
  staggerDelay = 0.08,
}: WordRevealProps) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.4,
            delay: delay + i * staggerDelay,
            ease: "easeOut",
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  PulseRing – pulsing ring effect (great for CTA buttons)           */
/* ------------------------------------------------------------------ */

interface PulseRingProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

function PulseRing({ children, color = "#C9A7EB", className }: PulseRingProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{ border: `2px solid ${color}` }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exports                                                           */
/* ------------------------------------------------------------------ */

export {
  AnimatedSection,
  StaggeredContainer,
  StaggeredItem,
  AnimatedCounter,
  FloatingElement,
  FloatingShape,
  GradientOrb,
  SparkleField,
  WordReveal,
  PulseRing,
};
