"use client";

/**
 * Tiny synthesized sound effects via the Web Audio API — no audio files
 * to download, so this never adds to page weight. Muted by default;
 * only plays when the user has enabled sound via SoundToggle.
 */

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as any).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioContext) audioContext = new Ctor();
  return audioContext;
}

function tone(freq: number, startOffset: number, duration: number, ctx: AudioContext, gainPeak = 0.06) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  const startTime = ctx.currentTime + startOffset;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

export function playCorrectionSound() {
  const ctx = getContext();
  if (!ctx) return;
  tone(392, 0, 0.18, ctx); // G4
  tone(523.25, 0.12, 0.22, ctx); // C5
}

export function playEnvelopeSound() {
  const ctx = getContext();
  if (!ctx) return;
  tone(440, 0, 0.12, ctx, 0.045); // A4
  tone(659.25, 0.08, 0.2, ctx, 0.045); // E5
}

export function playConfirmSound() {
  const ctx = getContext();
  if (!ctx) return;
  tone(523.25, 0, 0.16, ctx); // C5
  tone(659.25, 0.1, 0.16, ctx); // E5
  tone(783.99, 0.2, 0.28, ctx); // G5
}
