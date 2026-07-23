"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { INVITE_CONFIG, DateOption } from "@/lib/config";
import { getOrCreateSessionId } from "@/lib/session";
import { logVisit, submitResponse } from "@/lib/api";
import { firePetalConfetti } from "@/lib/confetti";
import { PetalField } from "@/components/ui/PetalField";
import { PetalCounter } from "@/components/ui/PetalCounter";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { OpeningScene } from "@/components/scenes/OpeningScene";
import { PredictionScene } from "@/components/scenes/PredictionScene";
import { RevealScene } from "@/components/scenes/RevealScene";
import { DecisionScene } from "@/components/scenes/DecisionScene";
import { YesScene } from "@/components/scenes/YesScene";
import { NoScene } from "@/components/scenes/NoScene";
import { Answer } from "@/types";

type Scene = "opening" | "prediction" | "reveal" | "decision" | "yes" | "no";

export function InviteExperience() {
  const [scene, setScene] = useState<Scene>("opening");
  const [sessionId, setSessionId] = useState("");
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateOption>(INVITE_CONFIG.dateOptions[0]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [petalsCaught, setPetalsCaught] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isTest = params.get("test") === "1";
    setTestMode(isTest);

    const id = getOrCreateSessionId();
    setSessionId(id);

    logVisit(id, isTest).then((result) => {
      if (result?.csrfToken) setCsrfToken(result.csrfToken);
    });
  }, []);

  async function finalizeAnswer(answer: Answer) {
    setSubmitting(true);
    setErrorMessage(null);

    if (csrfToken) {
      const result = await submitResponse({
        answer,
        sessionId,
        chosenDate: selectedDate.isoDate,
        csrfToken,
        test: testMode,
      });
      if (!result.ok) {
        // Recording failed, but we don't let a backend hiccup block a
        // romantic moment — she still sees her confirmation. The error
        // is surfaced only for local debugging.
        console.error("Response recording failed:", result.error);
      }
    }

    setSubmitting(false);
    setScene(answer === "yes" ? "yes" : "no");
  }

  function restart() {
    setScene("opening");
    setErrorMessage(null);
  }

  function previewScene(target: "yes" | "no") {
    setScene(target);
  }

  function handlePetalCatch() {
    setPetalsCaught((c) => {
      const next = c + 1;
      if (next === 10) firePetalConfetti();
      return next;
    });
  }

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-cream-50 via-blush-50 to-blush-100 px-4 py-10">
      <PetalField count={26} onCatch={handlePetalCatch} />
      <SoundToggle />
      <div className={testMode ? "fixed top-16 left-4 z-50" : "fixed top-4 left-4 z-50"}>
        <PetalCounter count={petalsCaught} />
      </div>

      {testMode && (
        <div className="fixed top-4 left-4 z-50 rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white shadow">
          TEST MODE &mdash; no submissions stored
        </div>
      )}

      <div className="relative z-10 w-full flex flex-col items-center gap-4">
        <AnimatePresence mode="wait">
          {scene === "opening" && (
            <OpeningScene key="opening" onContinue={() => setScene("prediction")} />
          )}
          {scene === "prediction" && (
            <PredictionScene key="prediction" onContinue={() => setScene("reveal")} />
          )}
          {scene === "reveal" && (
            <RevealScene key="reveal" onContinue={() => setScene("decision")} />
          )}
          {scene === "decision" && (
            <DecisionScene
              key="decision"
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onYes={() => finalizeAnswer("yes")}
              onNo={() => finalizeAnswer("no")}
              submitting={submitting}
              errorMessage={errorMessage}
            />
          )}
          {scene === "yes" && (
            <YesScene key="yes" chosenDate={selectedDate} onRestart={restart} />
          )}
          {scene === "no" && <NoScene key="no" onRestart={restart} />}
        </AnimatePresence>
      </div>

      {testMode && (
        <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-2">
          <button
            type="button"
            onClick={() => previewScene("yes")}
            className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-rose-700 shadow"
          >
            Preview: Yes ending
          </button>
          <button
            type="button"
            onClick={() => previewScene("no")}
            className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-rose-700 shadow"
          >
            Preview: No ending
          </button>
        </div>
      )}
    </main>
  );
}
