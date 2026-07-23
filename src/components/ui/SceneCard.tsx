"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { SparkleField } from "./SparkleField";

export function SceneCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full max-w-md rounded-[2rem] border border-white/60 bg-white/70 p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(201,79,112,0.35)] backdrop-blur-md ${className}`}
    >
      <SparkleField count={10} />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
