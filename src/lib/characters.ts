import charactersJson from "@/data/characters.json";
import lessonsJson from "@/data/lessons.json";

export interface CharRecord {
  hanzi: string;
  pinyin: string;
  level: number;
  freq: number;
  meaningPrimary: string;
  meaningsRu: string[];
  meaningsEn: string[];
  hasStrokes: boolean;
  decomposition?: string;
  components?: string[];
  radical?: string;
  etymology?: string;
}

export interface Lesson {
  id: string;
  level: number;
  index: number;
  characters: string[];
  grammarNote?: {
    title: string;
    body: string;
    examples?: { hanzi: string; pinyin: string; ru: string }[];
  };
}

export const ALL_CHARACTERS: CharRecord[] = charactersJson as CharRecord[];
export const HSK1_LESSONS: Lesson[] = lessonsJson as Lesson[];

const byHanzi = new Map<string, CharRecord>();
for (const c of ALL_CHARACTERS) byHanzi.set(c.hanzi, c);

export function getChar(hanzi: string): CharRecord | undefined {
  return byHanzi.get(hanzi);
}

export function getLesson(id: string): Lesson | undefined {
  return HSK1_LESSONS.find((l) => l.id === id);
}

/** Russian display meaning, falls back to English. */
export function meaningRu(c: CharRecord): string {
  if (c.meaningPrimary) return c.meaningPrimary;
  return c.meaningsEn[0] ?? "";
}

/**
 * A short, single-clause meaning suitable for buttons and lists. CEDICT defs
 * often contain several semicolon-separated clauses or parenthetical notes,
 * which look noisy as multiple-choice options.
 */
export function meaningShort(c: CharRecord): string {
  const raw = meaningRu(c);
  if (!raw) return "";
  // Strip leading parenthetical qualifiers like "(sentence-final particle) X"
  const stripped = raw.replace(/^\([^)]*\)\s*/u, "").trim() || raw;
  // Cut at first semicolon / slash / comma — keep the first sense only.
  const m = stripped.split(/[;／/]/, 1)[0];
  // Cap length so options stay tidy.
  return m.length > 60 ? m.slice(0, 57).trimEnd() + "…" : m;
}

/** Returns all chars in a given HSK level. */
export function charsByLevel(level: number): CharRecord[] {
  return ALL_CHARACTERS.filter((c) => c.level === level);
}
