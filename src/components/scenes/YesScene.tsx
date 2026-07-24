"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SceneCard } from "@/components/ui/SceneCard";
import { Button } from "@/components/ui/Button";
import { INVITE_CONFIG, DateOption } from "@/lib/config";
import { downloadIcsFile } from "@/lib/ics";
import { fireHeartAndSushiConfetti } from "@/lib/confetti";
import { useSound } from "@/components/ui/SoundProvider";
import { CalendarHeart } from "lucide-react";
import { CatMeme } from "@/components/ui/CatMeme";

export function YesScene({ chosenDate, onRestart }: { chosenDate: DateOption; onRestart: () => void }) {
  const hasFired = useRef(false);
  const { playConfirm } = useSound();

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;
    playConfirm();
    fireHeartAndSushiConfetti();
  }, [playConfirm]);

  return (
    <SceneCard>
      <div className="flex flex-col items-center text-center gap-5">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 12 }}
          className="text-5xl"
          aria-hidden="true"
        >
          🍣🌸
        </motion.span>

        <h2 className="font-serif text-3xl text-rose-800">It&rsquo;s officially a night away.</h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 240, damping: 16 }}
        >
          <CatMeme variant="happy" caption="This cat gets it." />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full rounded-2xl border-2 border-dashed border-rose-300 bg-white/80 px-5 py-5 shadow-sm"
        >
          <div className="flex items-center justify-center gap-2 text-rose-500 mb-1">
            <CalendarHeart size={18} aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wide">Save the night</span>
          </div>
          <p className="font-serif text-xl text-rose-800">{chosenDate.label}</p>
          <p className="font-sans text-rose-600">
            {INVITE_CONFIG.location} &mdash; we&rsquo;ll sort the time out together
          </p>
        </motion.div>

        <p className="font-sans text-rose-600">
          I&rsquo;ll handle the plan. You only need to arrive hungry.
        </p>

        <Button
          onClick={() => downloadIcsFile(chosenDate)}
          aria-label="Add this to your calendar"
        >
          Add to Calendar
        </Button>

        <p className="text-xs text-rose-400 italic font-sans">
          Screenshot this before the magic wears off.
        </p>

        <button
          type="button"
          onClick={onRestart}
          className="text-sm text-rose-400 underline underline-offset-2 hover:text-rose-500"
        >
          Back to the beginning
        </button>
      </div>
    </SceneCard>
  );
}
