"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SceneCard } from "@/components/ui/SceneCard";
import { Button } from "@/components/ui/Button";
import { Stamp } from "@/components/ui/Stamp";
import { CatMeme } from "@/components/ui/CatMeme";
import { INVITE_CONFIG } from "@/lib/config";
import { useSound } from "@/components/ui/SoundProvider";
import { fireCorrectionConfetti } from "@/lib/confetti";

const LOADING_MESSAGES = [
  "Consulting the football universe…",
  "Checking VAR… 🟨",
  "Confidence.exe has stopped responding 💀",
  "A correction spell has been cast. ✨",
];

const PUNCHLINE = "0% accurate. 100% charming.";

// Timings are deliberately unhurried — each message needs to actually be
// read before the next one replaces it.
const INTRO_DELAY_MS = 1400;
const MESSAGE_INTERVAL_MS = 1150;
const CORRECTING_PAUSE_MS = 1900;

type Phase = "scorecard" | "loading" | "correcting" | "corrected";

export function PredictionScene({ onContinue }: { onContinue: () => void }) {
  const [phase, setPhase] = useState<Phase>("scorecard");
  const [messageIndex, setMessageIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const { playCorrection } = useSound();
  const hasFiredConfetti = useRef(false);

  const { prediction, actual } = INVITE_CONFIG;

  useEffect(() => {
    const toLoading = setTimeout(() => setPhase("loading"), INTRO_DELAY_MS);
    return () => clearTimeout(toLoading);
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    if (messageIndex >= LOADING_MESSAGES.length - 1) {
      const toCorrecting = setTimeout(() => setPhase("correcting"), MESSAGE_INTERVAL_MS);
      return () => clearTimeout(toCorrecting);
    }
    const advance = setTimeout(() => setMessageIndex((i) => i + 1), MESSAGE_INTERVAL_MS);
    return () => clearTimeout(advance);
  }, [phase, messageIndex]);

  useEffect(() => {
    if (phase !== "correcting") return;
    const toCorrected = setTimeout(() => {
      setPhase("corrected");
      if (!hasFiredConfetti.current) {
        hasFiredConfetti.current = true;
        playCorrection();
        fireCorrectionConfetti();
      }
    }, CORRECTING_PAUSE_MS);
    return () => clearTimeout(toCorrected);
  }, [phase, playCorrection]);

  return (
    <SceneCard>
      <div className="flex flex-col items-center text-center gap-5">
        <h2 className="font-serif text-2xl sm:text-3xl text-rose-800">Your prediction entered the system&hellip;</h2>

        <div className="w-full rounded-2xl bg-white/80 border border-rose-100 shadow-inner px-4 py-6 sm:px-6">
          <div className="grid grid-cols-3 items-center gap-2">
            <TeamLabel name={prediction.home} />
            <ScoreDuel
              phase={phase}
              predictedHome={prediction.homeScore}
              predictedAway={prediction.awayScore}
              actualHome={actual.homeScore}
              actualAway={actual.awayScore}
              reduceMotion={!!reduceMotion}
            />
            <TeamLabel name={prediction.away} />
          </div>

          <div className="mt-4 min-h-[2.75rem] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {phase === "loading" && (
                <motion.div
                  key={messageIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex gap-1.5" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-rose-400"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-rose-500/90 font-sans italic">
                    {LOADING_MESSAGES[messageIndex]}
                  </p>
                </motion.div>
              )}
              {phase === "corrected" && (
                <motion.div
                  key="stamp"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Stamp text="Corrected by magic ✨" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {phase === "corrected" && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 240, damping: 16 }}
            >
              <CatMeme variant="wizard" caption={PUNCHLINE} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "corrected" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Button onClick={onContinue} aria-label="See what you won">
                See what you won 🍣
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneCard>
  );
}

function TeamLabel({ name }: { name: string }) {
  return <p className="font-sans text-sm sm:text-base font-medium text-rose-700">{name}</p>;
}

function ScoreDuel({
  phase,
  predictedHome,
  predictedAway,
  actualHome,
  actualAway,
  reduceMotion,
}: {
  phase: Phase;
  predictedHome: number;
  predictedAway: number;
  actualHome: number;
  actualAway: number;
  reduceMotion: boolean;
}) {
  const correcting = phase === "correcting" || phase === "corrected";

  return (
    <div className="flex items-center justify-center gap-2 font-serif text-3xl sm:text-4xl text-rose-800">
      <DigitCorrect
        predicted={predictedHome}
        actual={actualHome}
        correcting={correcting}
        reduceMotion={reduceMotion}
      />
      <span className="text-rose-300">&ndash;</span>
      <DigitCorrect
        predicted={predictedAway}
        actual={actualAway}
        correcting={correcting}
        reduceMotion={reduceMotion}
      />
    </div>
  );
}

function DigitCorrect({
  predicted,
  actual,
  correcting,
  reduceMotion,
}: {
  predicted: number;
  actual: number;
  correcting: boolean;
  reduceMotion: boolean;
}) {
  const changed = predicted !== actual;
  const showOld = !correcting || !changed;

  return (
    <span className="relative inline-flex h-12 w-10 items-center justify-center">
      <AnimatePresence mode="popLayout">
        {showOld ? (
          <motion.span
            key="old"
            initial={{ opacity: 0 }}
            animate={
              correcting && changed
                ? reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.3, rotate: 80, filter: "blur(3px)" }
                : { opacity: 1, scale: 1 }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {predicted}
          </motion.span>
        ) : (
          <motion.span
            key="new"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.3, y: -18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.3 }}
            className="text-rose-500 text-glow"
          >
            {actual}
          </motion.span>
        )}
      </AnimatePresence>

      {correcting && changed && !reduceMotion && (
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 0.6 }}
          className="absolute left-0.5 right-0.5 top-1/2 h-0.5 origin-left rounded bg-rose-500"
        />
      )}
    </span>
  );
}
