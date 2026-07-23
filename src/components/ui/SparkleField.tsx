"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Sparkle {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
}

/** Subtle twinkling sparkles layered within a scene. Decorative only. */
export function SparkleField({ count = 10 }: { count?: number }) {
  const reduceMotion = useReducedMotion();
  // Randomized, so generate only after mount to avoid SSR/client mismatch.
  const [sparkles, setSparkles] = useState<Sparkle[] | null>(null);

  useEffect(() => {
    setSparkles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 3 + Math.random() * 5,
        delay: Math.random() * 3,
      }))
    );
  }, [count]);

  if (!sparkles) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className={reduceMotion ? "absolute opacity-40" : "absolute animate-sparkle"}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        >
          <span className="block h-full w-full rounded-full bg-gold-300/80 shadow-[0_0_8px_2px_rgba(240,217,154,0.6)]" />
        </span>
      ))}
    </div>
  );
}
