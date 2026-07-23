"use client";

import { AnimatePresence, motion } from "framer-motion";

const MILESTONE = 10;

export function PetalCounter({ count }: { count: number }) {
  if (count <= 0) return null;

  const atMilestone = count === MILESTONE;

  return (
    <div className="flex flex-col items-start gap-1.5">
      <motion.div
        key={count}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-sm font-medium text-rose-600 shadow-md backdrop-blur-sm"
      >
        <span aria-hidden="true">🌸</span>
        <span>
          {count} caught
        </span>
      </motion.div>

      <AnimatePresence>
        {atMilestone && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white shadow-md"
          >
            Petal Master 🌸
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
