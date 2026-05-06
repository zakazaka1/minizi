"use client";

import Link from "next/link";
import { HSK1_LESSONS } from "@/lib/characters";
import { useProgress } from "@/store/progress";
import { Card } from "@/components/ui/Card";
import { Panda } from "@/components/ui/Panda";
import { ProgressBar } from "@/components/ui/Progress";
import { ArrowRight, BookOpen, Lock, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export default function LearnPage() {
  const completed = useProgress((s) => s.completedLessons);
  const totalLessons = HSK1_LESSONS.length;
  const completedCount = completed.length;
  const nextLesson =
    HSK1_LESSONS.find((l) => !completed.includes(l.id)) ?? HSK1_LESSONS[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Header */}
      <header className="flex items-end justify-between gap-6 mb-8">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-soft)] mb-2">
            Изучение · HSK 1
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-medium">
            От первой черты до уверенного письма
          </h1>
          <p className="text-[var(--foreground-muted)] mt-2 max-w-xl">
            300 иероглифов HSK 1, разбитых на короткие уроки по 5. Урок —
            показ значения, порядок черт, письмо по образцу и закрепление.
          </p>
        </div>
        <div className="hidden md:block">
          <Panda mood="learning" size={140} />
        </div>
      </header>

      {/* Big "next lesson" card */}
      <Card className="p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div
          className="rounded-[18px] overflow-hidden border border-[var(--border)]"
          style={{ width: 160, height: 100 }}
        >
          <Image
            src="/category/category_hsk1.png"
            alt="HSK 1"
            width={320}
            height={200}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-soft)] mb-1">
            Продолжайте
          </div>
          <div className="text-xl font-display font-medium">
            Урок {nextLesson.index + 1} · {nextLesson.characters.join(" ")}
          </div>
          <div className="text-sm text-[var(--foreground-muted)] mt-1">
            {nextLesson.grammarNote
              ? `Грамматика: ${nextLesson.grammarNote.title}`
              : "5 новых иероглифов · письмо · закрепление"}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <ProgressBar value={completedCount} max={totalLessons} className="max-w-xs" />
            <span className="text-xs text-[var(--foreground-muted)] tabular-nums">
              {completedCount} / {totalLessons}
            </span>
          </div>
        </div>
        <Link
          href={`/learn/${nextLesson.id}`}
          className="btn btn-primary"
        >
          Начать урок <ArrowRight size={16} />
        </Link>
      </Card>

      {/* Lesson grid */}
      <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-soft)] mb-3">
        Все уроки
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {HSK1_LESSONS.map((lesson, i) => {
          const isDone = completed.includes(lesson.id);
          const isLocked =
            !isDone && i > completedCount; // unlock sequentially
          const isCurrent = !isDone && i === completedCount;
          return (
            <Link
              key={lesson.id}
              href={isLocked ? "#" : `/learn/${lesson.id}`}
              className={cn(
                "card-soft p-3 flex flex-col gap-2 transition-shadow",
                isLocked && "opacity-60 cursor-not-allowed",
                isCurrent && "ring-2 ring-[var(--green)] ring-offset-2 ring-offset-[var(--background)]",
                !isLocked && "hover:shadow-md"
              )}
              aria-disabled={isLocked}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--foreground-muted)]">
                  Урок {i + 1}
                </span>
                {isDone ? (
                  <CheckCircle2 size={14} className="text-[var(--green)]" />
                ) : isLocked ? (
                  <Lock size={14} className="text-[var(--foreground-soft)]" />
                ) : (
                  <BookOpen size={14} className="text-[var(--foreground-muted)]" />
                )}
              </div>
              <div className="hanzi text-2xl tracking-wider">
                {lesson.characters.join("")}
              </div>
              {lesson.grammarNote && (
                <div className="text-[11px] text-[var(--foreground-muted)] line-clamp-1">
                  {lesson.grammarNote.title}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
