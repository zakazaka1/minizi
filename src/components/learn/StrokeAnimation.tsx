"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Play, Pause, RotateCcw } from "lucide-react";

interface Props {
  hanzi: string;
  size?: number;
  className?: string;
  autoplay?: boolean;
  /** Called when the data is loaded (and stroke count is known). */
  onReady?: (totalStrokes: number) => void;
}

export function StrokeAnimation({
  hanzi,
  size = 300,
  className,
  autoplay = true,
  onReady,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<unknown>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const node = containerRef.current;
    if (!node) return;
    node.innerHTML = "";

    (async () => {
      try {
        const HanziWriter = (await import("hanzi-writer")).default;
        if (cancelled || !containerRef.current) return;
        const writer = HanziWriter.create(containerRef.current, hanzi, {
          width: size,
          height: size,
          padding: 8,
          showCharacter: true,
          showOutline: true,
          strokeAnimationSpeed: 1.1,
          delayBetweenStrokes: 220,
          strokeColor: "#2a2c28",
          outlineColor: "#dad7cf",
          radicalColor: "#2e7d4f",
          drawingColor: "#c43a3a",
          // Tells the writer to fetch from chanind/hanzi-writer-data CDN
          charDataLoader(c, onComplete) {
            fetch(
              `https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${encodeURIComponent(
                c
              )}.json`
            )
              .then((r) => r.json())
              .then((d) => onComplete(d))
              .catch(() => onComplete(null as unknown as never));
          },
        });
        writerRef.current = writer;
        writer
          .getCharacterData()
          .then((data) => {
            if (cancelled) return;
            onReady?.(data.strokes.length);
            if (autoplay) {
              setPlaying(true);
              writer
                .animateCharacter({ onComplete: () => setPlaying(false) })
                .catch(() => setPlaying(false));
            }
          })
          .catch(() => setError("Не удалось загрузить данные иероглифа."));
      } catch (e) {
        if (!cancelled) setError("Ошибка загрузки модуля письма.");
        console.error(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hanzi, size, autoplay, onReady]);

  const replay = () => {
    const writer = writerRef.current as
      | {
          animateCharacter: (opts?: {
            onComplete?: () => void;
          }) => Promise<void>;
        }
      | null;
    if (!writer) return;
    setPlaying(true);
    writer
      .animateCharacter({ onComplete: () => setPlaying(false) })
      .catch(() => setPlaying(false));
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className="relative cali-grid rounded-[18px] border border-[var(--border)] bg-white"
        style={{ width: size + 24, height: size + 24, padding: 12 }}
      >
        <div ref={containerRef} aria-label={`Анимация порядка черт: ${hanzi}`} />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-[var(--foreground-muted)]">
            {error}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={replay}
          disabled={playing}
          className="btn btn-secondary h-10 w-10 p-0"
          aria-label="Повторить"
        >
          <RotateCcw size={16} />
        </button>
        <button
          type="button"
          onClick={replay}
          disabled={playing}
          className="btn btn-primary h-10 w-10 p-0"
          aria-label={playing ? "Пауза" : "Воспроизвести"}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>
    </div>
  );
}
