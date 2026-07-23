"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type Hue = "pink" | "rose" | "gold";

interface PetalParams {
  left: number;
  delay: number;
  duration: number;
  scale: number;
  drift: number;
  rotate: number;
  hue: Hue;
}

const HUE_FILL: Record<Hue, string> = {
  pink: "#ffbecb",
  rose: "#f0a3b8",
  gold: "#e2bd6c",
};

function randomParams(): PetalParams {
  const hues: Hue[] = ["pink", "rose", "gold"];
  return {
    left: Math.random() * 96 + 2,
    delay: Math.random() * 1.5,
    duration: 8 + Math.random() * 7,
    scale: 0.6 + Math.random() * 0.9,
    drift: (Math.random() - 0.5) * 140,
    rotate: Math.random() * 360,
    hue: hues[Math.floor(Math.random() * hues.length)],
  };
}

function PetalShape({ fill }: { fill: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C15 6 19 8 12 22C5 8 9 6 12 2Z" fill={fill} opacity="0.9" />
    </svg>
  );
}

/** A single falling petal that can be tapped to "catch" it, then respawns. */
function FallingPetal({ onCatch }: { onCatch: () => void }) {
  const [params, setParams] = useState<PetalParams>(() => randomParams());
  const [popped, setPopped] = useState(false);
  const [spawnKey, setSpawnKey] = useState(0);

  function handleCatch() {
    if (popped) return;
    setPopped(true);
    onCatch();
  }

  useEffect(() => {
    if (!popped) return;
    const respawn = setTimeout(() => {
      setParams(randomParams());
      setPopped(false);
      setSpawnKey((k) => k + 1);
    }, 550 + Math.random() * 400);
    return () => clearTimeout(respawn);
  }, [popped]);

  return (
    <div
      className="pointer-events-none absolute -top-8"
      style={{ left: `${params.left}%` }}
    >
      <AnimatePresence mode="wait">
        {!popped ? (
          <motion.button
            key={`fall-${spawnKey}`}
            type="button"
            onClick={handleCatch}
            aria-label="Catch this falling petal"
            className="pointer-events-auto block cursor-pointer p-2 -m-2"
            style={{ scale: params.scale }}
            initial={{ y: -40, x: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: "110vh",
              x: params.drift,
              opacity: [0, 1, 1, 0],
              rotate: params.rotate,
            }}
            transition={{ duration: params.duration, delay: params.delay, ease: "linear" }}
            whileHover={{ scale: params.scale * 1.3 }}
            whileTap={{ scale: params.scale * 0.7 }}
          >
            <PetalShape fill={HUE_FILL[params.hue]} />
          </motion.button>
        ) : (
          <motion.div
            key={`pop-${spawnKey}`}
            className="pointer-events-none relative"
            initial={{ opacity: 1, scale: params.scale }}
            animate={{ opacity: 0, scale: params.scale * 2.4 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-lg" aria-hidden="true">
              ✨
            </span>
            <PetalShape fill={HUE_FILL[params.hue]} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * A field of gently falling petals across the viewport. Tapping a petal
 * "catches" it with a little sparkle burst, and it respawns from the top —
 * a small, low-pressure interactive game layered over the decoration.
 * Paused entirely under prefers-reduced-motion.
 */
export function PetalField({
  count = 22,
  interactive = true,
  onCatch,
}: {
  count?: number;
  interactive?: boolean;
  onCatch?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const slots = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  const handleCatch = useCallback(() => {
    onCatch?.();
  }, [onCatch]);

  if (reduceMotion || !mounted) return null;

  return (
    <div
      className={`fixed inset-0 overflow-hidden z-0 ${interactive ? "" : "pointer-events-none"}`}
      aria-hidden="true"
    >
      {slots.map((id) =>
        interactive ? (
          <FallingPetal key={id} onCatch={handleCatch} />
        ) : (
          <StaticFallingPetal key={id} />
        )
      )}
    </div>
  );
}

function StaticFallingPetal() {
  const [params] = useState<PetalParams>(() => randomParams());
  return (
    <motion.div
      className="pointer-events-none absolute -top-8"
      style={{ left: `${params.left}%`, scale: params.scale }}
      initial={{ y: -40, x: 0, opacity: 0, rotate: 0 }}
      animate={{
        y: "110vh",
        x: params.drift,
        opacity: [0, 1, 1, 0],
        rotate: params.rotate,
      }}
      transition={{
        duration: params.duration,
        delay: params.delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <PetalShape fill={HUE_FILL[params.hue]} />
    </motion.div>
  );
}
