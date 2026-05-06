"use client";

import { useState } from "react";
import { CharRecord, getChar, meaningShort } from "@/lib/characters";
import { cn } from "@/lib/cn";

interface Props {
  char: CharRecord;
  /** Optional callback for when the user selects a grapheme. */
  onSelect?: (grapheme: string | null) => void;
}

/**
 * Display the visual decomposition of a character as a row of clickable
 * grapheme cards (radical / components). Selecting a grapheme highlights it
 * and notifies the parent so the surrounding UI can react (e.g. highlight the
 * matching strokes in the stroke animation).
 */
export function Graphemes({ char, onSelect }: Props) {
  const [picked, setPicked] = useState<string | null>(null);

  if (!char.components || char.components.length === 0) return null;

  const handlePick = (g: string) => {
    const next = picked === g ? null : g;
    setPicked(next);
    onSelect?.(next);
  };

  return (
    <div className="card-soft px-4 py-3 w-full">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--foreground-soft)] mb-2">
        Графемы
      </div>
      <div className="flex flex-wrap gap-2">
        {char.components.map((g, i) => {
          const sub = getChar(g);
          const meaning = sub ? meaningShort(sub) : "";
          const isPicked = picked === g;
          return (
            <button
              key={`${g}-${i}`}
              type="button"
              onClick={() => handlePick(g)}
              className={cn(
                "border rounded-md px-3 py-2 flex items-center gap-2 transition-colors",
                isPicked
                  ? "border-[var(--green)] bg-[var(--green-soft)]"
                  : "border-[var(--border)] bg-white hover:bg-[var(--surface-2)]"
              )}
              aria-pressed={isPicked}
            >
              <span
                className={cn(
                  "hanzi text-2xl leading-none",
                  isPicked && "text-[var(--green-deep)]"
                )}
              >
                {g}
              </span>
              {meaning && (
                <span className="text-xs text-[var(--foreground-muted)] max-w-[120px] truncate">
                  {meaning}
                </span>
              )}
            </button>
          );
        })}
        {char.radical &&
          !char.components.includes(char.radical) &&
          char.radical !== char.hanzi && (
            <div className="border border-dashed border-[var(--border)] rounded-md px-3 py-2 flex items-center gap-2">
              <span className="hanzi text-2xl leading-none">{char.radical}</span>
              <span className="text-xs text-[var(--foreground-muted)]">
                ключ
              </span>
            </div>
          )}
      </div>
      {char.etymology && (
        <div className="mt-3 text-xs text-[var(--foreground-muted)] leading-relaxed">
          {char.etymology}
        </div>
      )}
    </div>
  );
}
