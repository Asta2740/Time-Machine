"use client";

import { motion } from "framer-motion";
import { SceneCard } from "@/components/ui/SceneCard";
import { FlowerDivider } from "@/components/ui/FlowerDivider";
import { Button } from "@/components/ui/Button";
import { INVITE_CONFIG } from "@/lib/config";

export function OpeningScene({ onContinue }: { onContinue: () => void }) {
  return (
    <SceneCard>
      <div className="flex flex-col items-center text-center gap-5">
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl"
          aria-hidden="true"
        >
          🌸
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="font-serif text-3xl sm:text-4xl text-rose-800 leading-tight text-glow"
        >
          Hey, {INVITE_CONFIG.herName}&hellip;
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <FlowerDivider />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.7 }}
          className="text-lg text-rose-700/90 font-sans max-w-sm"
        >
          Remember your <em className="font-medium not-italic text-rose-800">very confident</em>{" "}
          Spain vs. Argentina prediction?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.3, duration: 0.5, type: "spring", stiffness: 200 }}
        >
          <Button
            onClick={onContinue}
            aria-label="Continue: Of course I remember my prediction"
            className="mt-2 text-lg"
          >
            Of course I do 🌸
          </Button>
        </motion.div>
      </div>
    </SceneCard>
  );
}
