"use client";

import confetti from "canvas-confetti";

const PINK_GOLD_PALETTE = ["#ff9fb2", "#f9799a", "#e2bd6c", "#ffd9e0", "#ffffff"];

function shapesFor(emojis: string[]) {
  try {
    return emojis.map((e) => confetti.shapeFromText({ text: e, scalar: 2 }));
  } catch {
    return undefined;
  }
}

export function fireCorrectionConfetti() {
  confetti({
    particleCount: 90,
    spread: 80,
    startVelocity: 38,
    origin: { y: 0.5 },
    colors: PINK_GOLD_PALETTE,
    scalar: 0.95,
  });
}

export function firePetalConfetti() {
  const shapes = shapesFor(["🌸", "🌷"]);
  confetti({
    particleCount: 60,
    spread: 110,
    startVelocity: 30,
    gravity: 0.6,
    origin: { y: 0.2 },
    colors: PINK_GOLD_PALETTE,
    shapes: shapes as any,
    scalar: shapes ? 1.1 : 0.9,
  });
}

export function fireHeartAndSushiConfetti() {
  const shapes = shapesFor(["🌸", "💗", "🍣", "✨"]);
  const duration = 1800;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.6 },
      colors: PINK_GOLD_PALETTE,
      shapes: shapes as any,
      scalar: shapes ? 1.4 : 1,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.6 },
      colors: PINK_GOLD_PALETTE,
      shapes: shapes as any,
      scalar: shapes ? 1.4 : 1,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
