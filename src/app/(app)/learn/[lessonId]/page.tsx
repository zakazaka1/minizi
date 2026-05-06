"use client";

import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ALL_CHARACTERS, HSK1_LESSONS, getLesson } from "@/lib/characters";
import { LessonFlow } from "@/components/learn/LessonFlow";

export default function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = use(params);
  const router = useRouter();
  const lesson = getLesson(lessonId) ?? HSK1_LESSONS[0];

  const characters = useMemo(
    () =>
      lesson.characters
        .map((h) => ALL_CHARACTERS.find((c) => c.hanzi === h))
        .filter(Boolean) as typeof ALL_CHARACTERS,
    [lesson]
  );

  const pool = useMemo(
    () =>
      ALL_CHARACTERS.filter(
        (c) => c.level <= 2 && c.meaningPrimary && c.pinyin
      ),
    []
  );

  return (
    <div className="min-h-screen flex flex-col">
      <LessonFlow
        lesson={lesson}
        characters={characters}
        pool={pool}
        onExit={() => router.push("/learn")}
      />
    </div>
  );
}
