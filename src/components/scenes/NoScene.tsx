"use client";

import { motion } from "framer-motion";
import { SceneCard } from "@/components/ui/SceneCard";
import { Button } from "@/components/ui/Button";
import { CatMeme } from "@/components/ui/CatMeme";

export function NoScene({ onRestart }: { onRestart: () => void }) {
  return (
    <SceneCard>
      <div className="flex flex-col items-center text-center gap-5">
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl"
          aria-hidden="true"
        >
          🌸
        </motion.span>

        <h2 className="font-serif text-2xl text-rose-800">
          No pressure. Your answer has been accepted without a VAR review.
        </h2>

        <p className="font-sans text-rose-600">The sushi shall survive another day.</p>

        <p className="font-sans text-rose-500/90 text-sm italic">
          No worries — we&rsquo;re still good.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <CatMeme variant="sad" caption="He'll recover. Eventually." />
        </motion.div>

        <Button variant="secondary" onClick={onRestart} aria-label="Return to the beginning">
          Back to the beginning
        </Button>
      </div>
    </SceneCard>
  );
}
