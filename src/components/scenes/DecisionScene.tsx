"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SceneCard } from "@/components/ui/SceneCard";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { INVITE_CONFIG, DateOption } from "@/lib/config";
import { buildDateOptionFromDate } from "@/lib/dateOption";
import { ShieldCheck, CalendarDays } from "lucide-react";
import { CatMeme } from "@/components/ui/CatMeme";

const NO_REACTIONS = [
  "A devastating result for the sushi industry.",
  "Are you sure? The sushi looked emotionally prepared.",
];

interface DecisionSceneProps {
  selectedDate: DateOption;
  onSelectDate: (option: DateOption) => void;
  onYes: () => void;
  onNo: () => void;
  submitting: boolean;
  errorMessage: string | null;
}

export function DecisionScene({
  selectedDate,
  onSelectDate,
  onYes,
  onNo,
  submitting,
  errorMessage,
}: DecisionSceneProps) {
  const [noClicks, setNoClicks] = useState(0);
  const [noNudge, setNoNudge] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const isPresetSelected = INVITE_CONFIG.dateOptions.some(
    (option) => option.isoDate === selectedDate.isoDate
  );

  function handleNoClick() {
    if (submitting) return;
    if (noClicks < NO_REACTIONS.length) {
      setNoClicks((c) => c + 1);
      setNoNudge(true);
      setTimeout(() => setNoNudge(false), 260);
      return;
    }
    onNo();
  }

  function handleCalendarSelect(isoDate: string) {
    const [y, m, d] = isoDate.split("-").map(Number);
    onSelectDate(buildDateOptionFromDate(new Date(y, m - 1, d)));
  }

  return (
    <SceneCard>
      <div className="flex flex-col items-center text-center gap-5">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-serif text-2xl sm:text-3xl text-rose-800"
        >
          So&hellip; shall I officially reserve your seat?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.5, type: "spring", stiffness: 240, damping: 16 }}
        >
          <CatMeme variant="happy2" caption="Even the cat is rooting for yes." />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full"
        >
          <p className="mb-2 text-sm font-medium text-rose-500/90 font-sans">Pick your day</p>
          <div className="grid grid-cols-2 gap-3">
            {INVITE_CONFIG.dateOptions.map((option) => {
              const active = option.isoDate === selectedDate.isoDate;
              return (
                <button
                  key={option.isoDate}
                  type="button"
                  onClick={() => onSelectDate(option)}
                  aria-pressed={active}
                  disabled={submitting}
                  className={`rounded-2xl border px-3 py-3 text-sm font-sans transition ${
                    active
                      ? "border-rose-400 bg-rose-50 text-rose-800 shadow-sm"
                      : "border-rose-100 bg-white/70 text-rose-500 hover:border-rose-200"
                  }`}
                >
                  <span className="block font-medium">{option.day}</span>
                  <span className="block text-xs opacity-80">{option.label.split(", ")[1]}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-sm text-rose-500/80 font-sans">
            {INVITE_CONFIG.location} &mdash; we&rsquo;ll sort the time out together
          </p>

          <button
            type="button"
            onClick={() => setShowCalendar((v) => !v)}
            disabled={submitting}
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-rose-500 underline underline-offset-2 hover:text-rose-600"
          >
            <CalendarDays size={14} aria-hidden="true" />
            {showCalendar ? "Hide calendar" : "None of these work? Pick another day"}
          </button>

          <AnimatePresence>
            {showCalendar && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 overflow-hidden"
              >
                <Calendar
                  selectedIsoDate={isPresetSelected ? null : selectedDate.isoDate}
                  onSelect={handleCalendarSelect}
                  initialMonth={new Date(INVITE_CONFIG.dateOptions[0].isoDate + "T00:00:00")}
                />
                {!isPresetSelected && (
                  <p className="mt-2 text-sm text-rose-600 font-sans">
                    You picked <span className="font-medium">{selectedDate.label}</span>.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex items-start gap-2 rounded-xl bg-rose-50/80 border border-rose-100 px-3 py-2.5 text-left"
        >
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-rose-400" aria-hidden="true" />
          <p className="text-xs text-rose-500/90 font-sans">
            Your response and basic visit information will be recorded so I know you answered.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="flex flex-col items-center gap-3 w-full mt-1"
        >
          <Button
            onClick={onYes}
            disabled={submitting}
            aria-label="Yes, I'm in"
            className="w-full text-lg"
          >
            Yes, I&rsquo;m in 🍣
          </Button>

          <motion.div animate={noNudge ? { x: [0, -10, 10, -6, 0] } : { x: 0 }} transition={{ duration: 0.26 }}>
            <Button
              onClick={handleNoClick}
              disabled={submitting}
              variant="secondary"
              aria-label="No, I'll let you recover from this loss"
            >
              No, I&rsquo;ll let you recover from this loss 🌸
            </Button>
          </motion.div>

          <AnimatePresence mode="wait">
            {noClicks > 0 && noClicks <= NO_REACTIONS.length && (
              <motion.p
                key={noClicks}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm italic text-rose-500/90 font-sans"
              >
                {NO_REACTIONS[noClicks - 1]}
              </motion.p>
            )}
          </AnimatePresence>

          {errorMessage && (
            <p role="alert" className="text-sm text-rose-600 font-sans">
              {errorMessage}
            </p>
          )}
        </motion.div>
      </div>
    </SceneCard>
  );
}
