"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toIsoDate } from "@/lib/dateOption";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function Calendar({
  selectedIsoDate,
  onSelect,
  initialMonth,
}: {
  selectedIsoDate: string | null;
  onSelect: (isoDate: string) => void;
  initialMonth: Date;
}) {
  const [viewDate, setViewDate] = useState(() => new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1));
  const today = startOfDay(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstOfMonth.getDay();

  const cells: (Date | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  function goToPrevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }

  function goToNextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="w-full rounded-2xl border border-rose-100 bg-white/85 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goToPrevMonth}
          aria-label="Previous month"
          className="rounded-full p-1.5 text-rose-500 hover:bg-rose-50"
        >
          <ChevronLeft size={18} />
        </button>
        <p className="font-serif text-sm font-medium text-rose-800">{monthLabel}</p>
        <button
          type="button"
          onClick={goToNextMonth}
          aria-label="Next month"
          className="rounded-full p-1.5 text-rose-500 hover:bg-rose-50"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={i} className="text-xs font-medium text-rose-400" aria-hidden="true">
            {label}
          </span>
        ))}

        {cells.map((date, i) => {
          if (!date) return <span key={`blank-${i}`} />;

          const isoDate = toIsoDate(date);
          const isPast = startOfDay(date) < today;
          const isSelected = isoDate === selectedIsoDate;

          return (
            <button
              key={isoDate}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(isoDate)}
              aria-label={date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
              aria-pressed={isSelected}
              className={`aspect-square rounded-full text-sm transition ${
                isSelected
                  ? "bg-rose-500 text-white shadow-sm"
                  : isPast
                    ? "text-rose-200 cursor-not-allowed"
                    : "text-rose-700 hover:bg-rose-50"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
