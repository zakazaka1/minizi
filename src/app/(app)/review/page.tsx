"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useProgress, dueChars, type Outcome } from "@/store/progress";
import { ALL_CHARACTERS, getChar, meaningRu } from "@/lib/characters";
import { Card } from "@/components/ui/Card";
import { Panda } from "@/components/ui/Panda";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/Progress";
import { Volume2, X, AlertCircle, CheckCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

const OUTCOMES: { id: Outcome; label: string; icon: React.ElementType; tone: string }[] = [
  { id: "again", label: "Не помню", icon: X, tone: "border-[var(--red)] text-[var(--red-deep)] bg-[var(--red-soft)]" },
  { id: "hard", label: "Сложно", icon: AlertCircle, tone: "border-amber-300 text-amber-800 bg-amber-50" },
  { id: "good", label: "Нормально", icon: CheckCircle, tone: "border-[var(--bamboo)] text-[var(--green-deep)] bg-[var(--bamboo-soft)]" },
  { id: "easy", label: "Легко", icon: Sparkles, tone: "border-[var(--green)] text-[var(--green-deep)] bg-[var(--green-soft)]" },
];

export default function ReviewPage() {
  const chars = useProgress((s) => s.chars);
  const recordOutcome = useProgress((s) => s.recordOutcome);

  const queue = useMemo(() => {
    const due = dueChars(chars);
    if (due.length > 0) return due.map((p) => p.hanzi);
    // Fallback: introduce frequent HSK1 characters
    return ALL_CHARACTERS.filter((c) => c.level === 1 && c.hasStrokes && c.meaningPrimary)
      .slice(0, 10)
      .map((c) => c.hanzi);
  }, [chars]);

  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const cur = queue[pos];
  const charRec = cur ? getChar(cur) : undefined;
  const speak = (text: string) => {
    if (typeof window === "undefined") return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  if (!cur || !charRec) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-8 py-12 text-center flex flex-col items-center gap-5">
        <Panda mood="resting" size={140} />
        <h1 className="text-3xl font-display font-medium">Повторений нет</h1>
        <p className="text-[var(--foreground-muted)]">
          Вы догнали все повторения. Возвращайтесь позже или начните новый урок.
        </p>
        <Link href="/learn" className="btn btn-primary">
          Начать урок
        </Link>
      </div>
    );
  }

  const onPick = (o: Outcome) => {
    recordOutcome(cur, o);
    if (pos + 1 >= queue.length) {
      setPos(0);
      setRevealed(false);
      return;
    }
    setPos((p) => p + 1);
    setRevealed(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-soft)] mb-1">
            Повторение
          </div>
          <h1 className="text-2xl font-display font-medium">
            Сегодняшние карточки
          </h1>
        </div>
        <span className="text-sm text-[var(--foreground-muted)] tabular-nums">
          {pos + 1} / {queue.length}
        </span>
      </header>
      <ProgressBar value={pos} max={queue.length} className="mb-6" />

      <Card className="p-8 flex flex-col items-center gap-5 float-up">
        <div className="hanzi text-[10rem] leading-none">{charRec.hanzi}</div>
        <button
          onClick={() => speak(charRec.hanzi)}
          className="btn btn-ghost h-9 w-9 p-0"
          aria-label="Произнести"
        >
          <Volume2 size={16} />
        </button>
        {!revealed ? (
          <Button onClick={() => setRevealed(true)} variant="secondary">
            Показать ответ
          </Button>
        ) : (
          <div className="text-center">
            <div className="pinyin text-2xl text-[var(--foreground-muted)]">
              {charRec.pinyin}
            </div>
            <div className="text-xl font-medium mt-2">{meaningRu(charRec)}</div>
          </div>
        )}
      </Card>

      {revealed && (
        <div className="grid grid-cols-2 gap-2.5 mt-6">
          {OUTCOMES.map(({ id, label, icon: Icon, tone }) => (
            <button
              key={id}
              onClick={() => onPick(id)}
              className={cn(
                "rounded-[14px] border px-4 py-3 flex items-center gap-2 text-sm font-medium hover:shadow-sm transition-shadow",
                tone
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
