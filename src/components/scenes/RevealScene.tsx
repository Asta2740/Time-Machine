"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SceneCard } from "@/components/ui/SceneCard";
import { Button } from "@/components/ui/Button";
import { FlowerDivider } from "@/components/ui/FlowerDivider";
import { INVITE_CONFIG } from "@/lib/config";
import { useSound } from "@/components/ui/SoundProvider";
import { firePetalConfetti } from "@/lib/confetti";

export function RevealScene({ onContinue }: { onContinue: () => void }) {
  const [opened, setOpened] = useState(false);
  const { playEnvelope } = useSound();

  function handleOpen() {
    if (opened) return;
    setOpened(true);
    playEnvelope();
    firePetalConfetti();
  }

  return (
    <SceneCard>
      <div className="flex flex-col items-center text-center gap-5">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.button
              key="closed"
              type="button"
              onClick={handleOpen}
              aria-label="Open your prize"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-4 rounded-3xl px-8 py-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-500"
            >
              <motion.span
                className="text-6xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              >
                🍣
              </motion.span>
              <span className="font-serif text-xl text-rose-800">Tap to see what you won</span>
            </motion.button>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="font-sans text-rose-600"
              >
                Your prediction may have missed the score&hellip;
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="font-sans text-rose-600"
              >
                But somehow, you still won.
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6, type: "spring", stiffness: 200, damping: 14 }}
                className="font-serif text-2xl sm:text-3xl text-rose-800 mt-1 text-glow"
              >
                You won a sushi night away 🍣🌸
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.6 }}
                className="w-full"
              >
                <FlowerDivider />
                <p className="font-sans text-rose-700 font-medium">
                  {INVITE_CONFIG.location} &mdash; we&rsquo;ll sort the time out together
                </p>
                <p className="mt-2 text-sm text-rose-500/90 font-sans italic">
                  Turns out being wrong has excellent benefits.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8, duration: 0.5 }}
              >
                <Button onClick={onContinue} className="mt-2" aria-label="Continue to reserve your seat">
                  Continue
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneCard>
  );
}
