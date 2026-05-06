"use client";

import { useMemo, useState } from "react";
import { ALL_CHARACTERS, meaningRu, type CharRecord } from "@/lib/characters";
import { useProgress } from "@/store/progress";
import { Card } from "@/components/ui/Card";
import { Star, Search, Volume2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { StrokeAnimation } from "@/components/learn/StrokeAnimation";

const FILTERS: { key: string; label: string; level?: number }[] = [
  { key: "all", label: "Все" },
  { key: "fav", label: "Избранное" },
  { key: "1", label: "HSK 1", level: 1 },
  { key: "2", label: "HSK 2", level: 2 },
  { key: "3", label: "HSK 3", level: 3 },
  { key: "4", label: "HSK 4+", level: 4 },
];

export default function DictionaryPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("1");
  const [picked, setPicked] = useState<CharRecord | null>(null);

  const charsState = useProgress((s) => s.chars);
  const toggleFav = useProgress((s) => s.toggleFavorite);

  const list = useMemo(() => {
    let xs = ALL_CHARACTERS;
    const f = FILTERS.find((x) => x.key === filter);
    if (f?.level === 4) {
      xs = xs.filter((c) => c.level >= 4);
    } else if (f?.level) {
      xs = xs.filter((c) => c.level === f.level);
    }
    if (filter === "fav") {
      xs = xs.filter((c) => charsState[c.hanzi]?.favorite);
    }
    if (query) {
      const q = query.toLowerCase();
      xs = xs.filter(
        (c) =>
          c.hanzi.includes(q) ||
          c.pinyin.toLowerCase().includes(q) ||
          meaningRu(c).toLowerCase().includes(q) ||
          c.meaningsEn.some((m) => m.toLowerCase().includes(q))
      );
    }
    return xs.slice(0, 400);
  }, [query, filter, charsState]);

  const speak = (text: string) => {
    if (typeof window === "undefined") return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
      <header className="flex items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-soft)] mb-1">
            Словарь
          </div>
          <h1 className="text-2xl font-display font-medium">Все иероглифы</h1>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="card-soft flex items-center gap-2 px-3 py-2 flex-1">
          <Search size={16} className="text-[var(--foreground-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по иероглифу, пиньиню или переводу"
            className="bg-transparent outline-none flex-1 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto scroll-hide mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "shrink-0 px-3.5 py-1.5 rounded-full text-sm border transition-colors",
              filter === f.key
                ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                : "bg-[var(--surface)] text-[var(--foreground-muted)] border-[var(--border)] hover:bg-[var(--surface-2)]"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* List */}
        <div className="grid gap-2">
          {list.length === 0 && (
            <div className="text-sm text-[var(--foreground-muted)] py-8 text-center">
              Ничего не найдено.
            </div>
          )}
          {list.map((c) => {
            const fav = charsState[c.hanzi]?.favorite;
            return (
              <button
                key={c.hanzi}
                onClick={() => setPicked(c)}
                className={cn(
                  "card-soft px-4 py-3 flex items-center gap-4 text-left hover:shadow-md transition-shadow",
                  picked?.hanzi === c.hanzi && "ring-1 ring-[var(--green)]"
                )}
              >
                <span className="hanzi text-3xl shrink-0">{c.hanzi}</span>
                <div className="flex-1 min-w-0">
                  <div className="pinyin text-[var(--foreground-muted)] text-sm">
                    {c.pinyin}
                  </div>
                  <div className="text-sm truncate">{meaningRu(c)}</div>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--foreground-soft)] mr-2">
                  HSK {c.level}
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFav(c.hanzi);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleFav(c.hanzi);
                    }
                  }}
                  className={cn(
                    "p-1.5 rounded-full hover:bg-[var(--surface-2)] cursor-pointer",
                    fav ? "text-[var(--red)]" : "text-[var(--foreground-soft)]"
                  )}
                  aria-label="В избранное"
                >
                  <Star size={16} fill={fav ? "currentColor" : "none"} />
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <Card className="p-6">
              {picked ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-soft)]">
                    HSK {picked.level}
                  </div>
                  <StrokeAnimation hanzi={picked.hanzi} size={220} autoplay />
                  <div className="flex items-center gap-2">
                    <span className="pinyin text-xl text-[var(--foreground-muted)]">
                      {picked.pinyin}
                    </span>
                    <button
                      onClick={() => speak(picked.hanzi)}
                      className="btn btn-ghost h-8 w-8 p-0"
                      aria-label="Произнести"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                  <div className="text-lg font-medium text-center">
                    {meaningRu(picked)}
                  </div>
                  {picked.meaningsEn.length > 0 && (
                    <div className="text-xs text-[var(--foreground-muted)] text-center">
                      {picked.meaningsEn.slice(0, 4).join(" · ")}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-[var(--foreground-muted)] text-center py-8">
                  Выберите иероглиф слева, чтобы посмотреть детали и порядок
                  черт.
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
