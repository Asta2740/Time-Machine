"use client";

import { motion } from "framer-motion";

/** Playful "Corrected by reality" rubber stamp that thuds into place. */
export function Stamp({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ scale: 2.2, opacity: 0, rotate: -18 }}
      animate={{ scale: 1, opacity: 1, rotate: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 13, delay: 0.1 }}
      className="pointer-events-none inline-flex select-none items-center gap-1.5 rounded-full border-2 border-rose-500/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-600"
    >
      {text} <span aria-hidden="true">✓</span>
    </motion.div>
  );
}
