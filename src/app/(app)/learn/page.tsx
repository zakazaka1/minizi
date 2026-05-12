"use client";

import Link from "next/link";
import { useMemo } from "react";
import { HSK1_LESSONS, type Lesson } from "@/lib/characters";
import { useProgress } from "@/store/progress";
import { Card } from "@/components/ui/Card";
import { Panda } from "@/components/ui/Panda";
import { ProgressBar } from "@/components/ui/Progress";
import { ArrowRight, Lock, Check, Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Theme presentation order + visual accents. Order here drives the order
 * sections appear on the page; lessons that don't have a matching theme
 * are bucketed at the end.
 */
const THEME_ORDER: { name: string; accent: string; emoji: string }[] = [
  { name: "Основы общения", accent: "bg-[#f6efe0] text-[#7a5a1f]", emoji: "💬" },
  { name: "Числа и счёт", accent: "bg-[#e8f1ea] text-[#2e6b3a]", emoji: "🔢" },
  { name: "Люди и семья", accent: "bg-[#f3e7ed] text-[#7a3a55]", emoji: "👪" },
  { name: "Время и место", accent: "bg-[#e6eef5] text-[#2c5277]", emoji: "🧭" },
  { name: "Действия", accent: "bg-[#f0eaf6] text-[#5a3d83]", emoji: "🏃" },
  { name: "Быт", accent: "bg-[#f5ece1] text-[#7a4d1e]", emoji: "🍵" },
  { name: "Описание", accent: "bg-[#eaf2f0] text-[#2a5f55]", emoji: "🎨" },
  { name: "Закрепление лексики", accent: "bg-[#ece9e3] text-[#4a4639]", emoji: "📚" },
];

export default function LearnPage() {
  const completed = useProgress((s) => s.completedLessons);
  const totalLessons = HSK1_LESSONS.length;
  const completedCount = completed.length;
  const nextLesson =
    HSK1_LESSONS.find((l) => !completed.includes(l.id)) ?? HSK1_LESSONS[0];

  /** Group lessons by theme, preserving lesson order within each group. */
  const grouped = useMemo(() => {
    const map = new Map<string, Lesson[]>();
    for (const lesson of HSK1_LESSONS) {
      const theme = lesson.theme ?? "Закрепление лексики";
      const arr = map.get(theme) ?? [];
      arr.push(lesson);
      map.set(theme, arr);
    }
    const knownThemes = new Set(THEME_ORDER.map((t) => t.name));
    const ordered: { name: string; lessons: Lesson[]; accent: string; emoji: string }[] = [];
    for (const t of THEME_ORDER) {
      const lessons = map.get(t.name);
      if (lessons) ordered.push({ name: t.name, lessons, accent: t.accent, emoji: t.emoji });
    }
    for (const [name, lessons] of map) {
      if (!knownThemes.has(name)) {
        ordered.push({ name, lessons, accent: "bg-[#ece9e3] text-[#4a4639]", emoji: "📚" });
      }
    }
    return ordered;
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Page header */}
      <header className="flex items-end justify-between gap-6 mb-8">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-soft)] mb-2">
            Изучение · HSK 1
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-medium leading-tight">
            От первой черты до уверенного письма
          </h1>
          <p className="text-[var(--foreground-muted)] mt-2 max-w-xl">
            300 иероглифов HSK 1, разбитых на короткие уроки по 5. Урок —
            показ значения, порядок черт, письмо по образцу и закрепление.
          </p>
        </div>
        <div className="hidden md:block shrink-0">
          <Panda mood="learning" size={140} />
        </div>
      </header>

      {/* Continue card */}
      <Card className="p-6 sm:p-7 mb-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
        <div className="flex flex-col items-center sm:items-stretch sm:flex-row gap-5 sm:gap-6 flex-1 min-w-0">
          <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--green-soft)] to-[#e8f1ea] border border-[var(--border)] shrink-0 w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]">
            <span className="hanzi text-5xl sm:text-6xl text-[var(--green-deep)] tracking-tight">
              {nextLesson.characters[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[var(--green-deep)] mb-1">
              <Sparkles size={12} /> Продолжайте
            </div>
            <div className="text-xl sm:text-2xl font-display font-medium leading-snug">
              Урок {nextLesson.index + 1}
              {nextLesson.title ? ` · ${nextLesson.title}` : ""}
            </div>
            <div className="hanzi text-2xl tracking-wider mt-1 text-[var(--foreground)]">
              {nextLesson.characters.join(" ")}
            </div>
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <ProgressBar
                value={completedCount}
                max={totalLessons}
                className="max-w-xs w-full"
              />
              <span className="text-xs text-[var(--foreground-muted)] tabular-nums whitespace-nowrap">
                {completedCount} / {totalLessons} уроков
              </span>
            </div>
          </div>
        </div>
        <Link
          href={`/learn/${nextLesson.id}`}
          className="btn btn-primary self-stretch sm:self-auto whitespace-nowrap"
        >
          Начать урок <ArrowRight size={16} />
        </Link>
      </Card>

      {/* Themed sections */}
      <div className="space-y-10">
        {grouped.map((section) => (
          <section key={section.name}>
            <div className="flex items-baseline justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-lg w-9 h-9 text-lg shrink-0",
                    section.accent
                  )}
                >
                  {section.emoji}
                </span>
                <h2 className="text-lg sm:text-xl font-display font-medium truncate">
                  {section.name}
                </h2>
              </div>
              <span className="text-xs text-[var(--foreground-muted)] tabular-nums shrink-0">
                {section.lessons.filter((l) => completed.includes(l.id)).length}
                {" / "}
                {section.lessons.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.lessons.map((lesson) => {
                const lessonOrderIdx = HSK1_LESSONS.findIndex(
                  (l) => l.id === lesson.id
                );
                const isDone = completed.includes(lesson.id);
                const isLocked = !isDone && lessonOrderIdx > completedCount;
                const isCurrent =
                  !isDone && lessonOrderIdx === completedCount;
                return (
                  <LessonTile
                    key={lesson.id}
                    lesson={lesson}
                    isDone={isDone}
                    isLocked={isLocked}
                    isCurrent={isCurrent}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function LessonTile({
  lesson,
  isDone,
  isLocked,
  isCurrent,
}: {
  lesson: Lesson;
  isDone: boolean;
  isLocked: boolean;
  isCurrent: boolean;
}) {
  const StatusIcon = isDone ? Check : isLocked ? Lock : Play;
  const statusClasses = isDone
    ? "bg-[var(--green-soft)] text-[var(--green-deep)] border-[var(--green-soft)]"
    : isLocked
      ? "bg-[var(--surface-2)] text-[var(--foreground-soft)] border-[var(--border)]"
      : "bg-[var(--green-deep)] text-white border-[var(--green-deep)]";

  return (
    <Link
      href={isLocked ? "#" : `/learn/${lesson.id}`}
      aria-disabled={isLocked}
      tabIndex={isLocked ? -1 : 0}
      className={cn(
        "group relative rounded-2xl border bg-white p-4 flex items-stretch gap-3 transition-all",
        isLocked
          ? "border-[var(--border)] opacity-70 cursor-not-allowed"
          : "border-[var(--border)] hover:shadow-md hover:-translate-y-px",
        isCurrent && "ring-2 ring-[var(--green-deep)] ring-offset-2 ring-offset-[var(--background)] border-transparent"
      )}
    >
      {/* Hanzi block (square, left) */}
      <div
        className={cn(
          "shrink-0 w-20 h-20 rounded-xl flex items-center justify-center text-center",
          isDone
            ? "bg-[var(--green-soft)]"
            : isLocked
              ? "bg-[var(--surface-2)]"
              : "bg-gradient-to-br from-[#f7f3e8] to-[#eef4ec]"
        )}
      >
        <span
          className={cn(
            "hanzi leading-none tracking-tight",
            lesson.characters.length <= 3 ? "text-2xl" : "text-xl",
            isLocked
              ? "text-[var(--foreground-soft)]"
              : "text-[var(--foreground)]"
          )}
        >
          {lesson.characters.join("")}
        </span>
      </div>

      {/* Right column: number + title + status */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--foreground-soft)] mb-0.5">
            Урок {lesson.index + 1}
          </div>
          <div className="text-sm font-medium leading-snug truncate">
            {lesson.title ?? `Урок ${lesson.index + 1}`}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 mt-2">
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-full border w-7 h-7 shrink-0",
              statusClasses
            )}
            aria-label={
              isDone ? "Пройден" : isLocked ? "Закрыт" : "Доступен"
            }
          >
            <StatusIcon size={14} strokeWidth={2.5} />
          </span>
          {lesson.grammarNote && (
            <span className="text-[11px] text-[var(--foreground-muted)] truncate min-w-0 text-right">
              {lesson.grammarNote.title}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
