"use client";

import Link from "next/link";
import { useState } from "react";
import { HSK1_LESSONS, type Lesson } from "@/lib/characters";
import { useProgress } from "@/store/progress";
import { useMounted } from "@/lib/useMounted";
import { Panda } from "@/components/ui/Panda";
import { ProgressBar } from "@/components/ui/Progress";
import { ArrowRight, Lock, Check, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/cn";

const LEVELS = [1, 2, 3, 4, 5, 6, 7] as const;
const CHARS_PER_LESSON = 5;
const HSK1_TOTAL_CHARS = HSK1_LESSONS.reduce(
  (s, l) => s + l.characters.length,
  0
);

export default function LearnPage() {
  const [level, setLevel] = useState<number>(1);
  const completed = useProgress((s) => s.completedLessons);
  const mounted = useMounted();

  const completedCount = mounted ? completed.length : 0;
  const completedCharsCount = mounted ? completedCount * CHARS_PER_LESSON : 0;
  const totalLessons = HSK1_LESSONS.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
      {/* Page header */}
      <header className="flex items-start justify-between gap-4 mb-6 sm:mb-8 min-h-[120px]">
        <div className="flex-1 min-w-0 pt-2">
          <h1 className="text-3xl sm:text-4xl font-display font-medium leading-tight">
            HSK {level} · Уроки
          </h1>
          <p className="text-[var(--foreground-muted)] mt-2 max-w-md leading-snug">
            Изучи {HSK1_TOTAL_CHARS} иероглифов и заложи фундамент китайского
            языка
          </p>
        </div>
        <div className="hidden sm:block shrink-0 -mt-2 -mr-2">
          <Panda mood="learning" size={160} priority />
        </div>
      </header>

      {/* Progress card */}
      <div className="card p-5 sm:p-6 mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--foreground-soft)] mb-2">
            Ваш прогресс
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-display font-medium text-[var(--green-deep)] tabular-nums">
              {completedCharsCount}
            </span>
            <span className="text-lg text-[var(--foreground-muted)] tabular-nums">
              / {HSK1_TOTAL_CHARS}
            </span>
          </div>
          <ProgressBar
            value={completedCharsCount}
            max={HSK1_TOTAL_CHARS}
            className="mt-3"
          />
        </div>
        <div className="sm:border-l sm:border-[var(--border)] sm:pl-6">
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--foreground-soft)] mb-2">
            Уроков пройдено
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-display font-medium text-[var(--green-deep)] tabular-nums">
              {completedCount}
            </span>
            <span className="text-lg text-[var(--foreground-muted)] tabular-nums">
              / {totalLessons}
            </span>
          </div>
        </div>
        <div className="sm:border-l sm:border-[var(--border)] sm:pl-6">
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--foreground-soft)] mb-2">
            Иероглифов изучено
          </div>
          <div className="text-3xl sm:text-4xl font-display font-medium text-[var(--green-deep)] tabular-nums">
            {completedCharsCount}
          </div>
        </div>
      </div>

      {/* HSK level tabs */}
      <div className="flex items-end gap-1 sm:gap-2 mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-[var(--border)]">
        {LEVELS.map((lvl) => {
          const active = lvl === level;
          const disabled = lvl !== 1;
          return (
            <button
              key={lvl}
              onClick={() => !disabled && setLevel(lvl)}
              disabled={disabled}
              className={cn(
                "px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative -mb-px",
                active
                  ? "text-[var(--green-deep)]"
                  : disabled
                    ? "text-[var(--foreground-soft)] cursor-not-allowed"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              )}
            >
              HSK {lvl}
              {active && (
                <span className="absolute inset-x-2 -bottom-px h-[2px] bg-[var(--green-deep)] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Lesson timeline */}
      {level === 1 ? (
        <ol className="relative" role="list">
          {/* Vertical connector line */}
          <span
            aria-hidden
            className="absolute left-[19px] top-6 bottom-6 w-px bg-[var(--border)]"
          />
          {HSK1_LESSONS.map((lesson, i) => {
            const isDone = mounted && completed.includes(lesson.id);
            const isCurrent =
              mounted && !isDone && i === completedCount;
            const isLocked = !isDone && !isCurrent;
            return (
              <li key={lesson.id} className="relative">
                <LessonRow
                  lesson={lesson}
                  isDone={isDone}
                  isCurrent={isCurrent}
                  isLocked={isLocked}
                />
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="card p-8 text-center text-[var(--foreground-muted)]">
          <BookOpen
            size={28}
            className="mx-auto mb-3 text-[var(--foreground-soft)]"
          />
          <div className="font-display text-xl text-[var(--foreground)] mb-1">
            HSK {level} — скоро
          </div>
          <p className="text-sm">
            Сейчас в Minzi открыт уровень HSK 1. Остальные уровни добавим в
            следующих обновлениях.
          </p>
        </div>
      )}

      {/* Bottom CTA banner */}
      <div className="mt-10 rounded-[var(--radius-lg)] border border-[var(--green-soft)] bg-[var(--bamboo-soft)] p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white border border-[var(--border)] items-center justify-center shrink-0">
          <BookOpen size={26} className="text-[var(--green-deep)]" />
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="font-display text-lg sm:text-xl text-[var(--foreground)] mb-1">
            Что дальше?
          </div>
          <p className="text-sm text-[var(--foreground-muted)] leading-snug">
            Продолжайте учиться и не забывайте повторять изученное в разделе
            «Повторение».
          </p>
        </div>
        <Link
          href="/review"
          className="btn btn-primary whitespace-nowrap"
          style={{ background: "var(--green)" }}
        >
          К повторению <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

function LessonRow({
  lesson,
  isDone,
  isCurrent,
  isLocked,
}: {
  lesson: Lesson;
  isDone: boolean;
  isCurrent: boolean;
  isLocked: boolean;
}) {
  const lessonNumber = lesson.index + 1;
  const node = isDone ? (
    <span className="relative z-10 w-10 h-10 rounded-full bg-[var(--green)] text-white flex items-center justify-center shadow-sm">
      <Check size={18} strokeWidth={3} />
    </span>
  ) : isCurrent ? (
    <span className="relative z-10 w-10 h-10 rounded-full bg-[var(--green-deep)] text-white flex items-center justify-center font-medium tabular-nums shadow-sm">
      {lessonNumber}
    </span>
  ) : (
    <span className="relative z-10 w-10 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground-soft)] flex items-center justify-center text-sm tabular-nums">
      {lessonNumber}
    </span>
  );

  const card = (
    <div
      className={cn(
        "flex-1 min-w-0 rounded-2xl border bg-white px-4 sm:px-5 py-4 flex items-center gap-3 sm:gap-4 transition-all",
        isCurrent
          ? "border-[var(--green-soft)] bg-[var(--bamboo-soft)] shadow-sm"
          : isDone
            ? "border-[var(--border)] hover:shadow-sm"
            : "border-[var(--border)] opacity-80"
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--foreground-soft)] mb-1">
          Урок {lessonNumber}
        </div>
        <div className="hanzi text-lg sm:text-xl tracking-wider text-[var(--foreground)] leading-tight">
          {lesson.characters.join(" ")}
        </div>
        <div className="text-xs text-[var(--foreground-muted)] mt-1">
          {lesson.characters.length} иероглифов
          {lesson.title && (
            <>
              {" · "}
              <span className="text-[var(--foreground)]">{lesson.title}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {isDone && <DoneBadge />}
        {isCurrent && (
          <span className="btn btn-primary h-10 px-4 text-sm whitespace-nowrap">
            Продолжить <ArrowRight size={14} />
          </span>
        )}
        {isLocked && (
          <span
            className="w-10 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground-soft)]"
            aria-label="Закрыто"
          >
            <Lock size={16} />
          </span>
        )}
        <ChevronRight
          size={18}
          className={cn(
            "shrink-0",
            isLocked
              ? "text-[var(--foreground-soft)]"
              : "text-[var(--foreground-muted)]"
          )}
        />
      </div>
    </div>
  );

  const rowClass =
    "flex items-stretch gap-4 sm:gap-5 py-2.5 sm:py-3 first:pt-0 last:pb-0";
  const nodeWrap = (
    <div className="w-10 shrink-0 flex items-start justify-center pt-3">
      {node}
    </div>
  );

  if (isLocked) {
    return (
      <div
        className={cn(rowClass, "cursor-not-allowed")}
        aria-disabled="true"
      >
        {nodeWrap}
        {card}
      </div>
    );
  }
  return (
    <Link
      href={`/learn/${lesson.id}`}
      className={cn(rowClass, "group focus:outline-none")}
    >
      {nodeWrap}
      {card}
    </Link>
  );
}

function DoneBadge() {
  return (
    <div className="hidden sm:flex items-center gap-2">
      <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--green-soft)] text-[var(--green-deep)] font-medium whitespace-nowrap">
        Пройдено
      </span>
      <span
        className="w-10 h-10 rounded-full border-[2.5px] border-[var(--green)] text-[var(--green-deep)] flex items-center justify-center text-[10px] font-medium tabular-nums"
        aria-label="100%"
      >
        100%
      </span>
    </div>
  );
}
