"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { playCorrectionSound, playConfirmSound, playEnvelopeSound } from "@/lib/sound";

interface SoundContextValue {
  enabled: boolean;
  toggle: () => void;
  playCorrection: () => void;
  playEnvelope: () => void;
  playConfirm: () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false); // muted by default

  const toggle = useCallback(() => setEnabled((v) => !v), []);

  const playCorrection = useCallback(() => {
    if (enabled) playCorrectionSound();
  }, [enabled]);

  const playEnvelope = useCallback(() => {
    if (enabled) playEnvelopeSound();
  }, [enabled]);

  const playConfirm = useCallback(() => {
    if (enabled) playConfirmSound();
  }, [enabled]);

  return (
    <SoundContext.Provider value={{ enabled, toggle, playCorrection, playEnvelope, playConfirm }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
