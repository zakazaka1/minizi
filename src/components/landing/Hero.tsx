import Link from "next/link";
import Image from "next/image";
import { HeroDemo } from "./HeroDemo";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative bamboo */}
      <Image
        src="/bamboo/bamboo_2.png"
        alt=""
        width={120}
        height={300}
        className="absolute -left-4 top-[8%] w-24 opacity-90 hidden md:block pointer-events-none select-none"
      />
      <Image
        src="/bg/bg_mountain_sun.png"
        alt=""
        width={600}
        height={400}
        className="absolute right-0 bottom-0 w-[360px] opacity-50 hidden lg:block pointer-events-none select-none"
        style={{
          // Soft radial fade so the illustration blends into the section
          // edges instead of being clipped to a hard rectangle.
          maskImage:
            "radial-gradient(ellipse at 30% 70%, black 35%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 30% 70%, black 35%, transparent 80%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-12 items-center">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--green-deep)] mb-4 font-medium">
            пишите · понимайте · запоминайте
          </div>
          <h1 className="text-4xl sm:text-[3.5rem] lg:text-[4.25rem] leading-[1.05] font-display font-medium tracking-tight">
            Учите иероглифы<br />через письмо.<br />
            <span className="text-[var(--green-deep)]">Запоминайте надолго.</span>
          </h1>
          <p className="mt-6 text-[var(--foreground-muted)] max-w-xl text-base sm:text-lg leading-relaxed">
            Мы учим не просто распознавать, а писать и понимать иероглифы.
            Правильный порядок черт, активная практика и умные повторения —
            всё, чтобы знания остались с вами.
          </p>
          <div className="mt-7 flex items-center gap-3 flex-wrap">
            <Link href="/learn" className="btn btn-primary btn-lg h-12 px-6 text-[0.95rem]">
              Начать учить иероглифы правильно <ArrowRight size={16} />
            </Link>
            <a href="#how" className="btn btn-secondary h-12 px-5 text-[0.95rem]">
              <Play size={14} /> Смотреть, как это работает
            </a>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-[var(--background)] bg-gradient-to-br from-[var(--surface-3)] to-[var(--surface-2)]"
                />
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-2 text-[var(--foreground)]">
                <span className="text-amber-500">★★★★</span>
                <span className="text-amber-500/60">★</span>
                <span className="text-[var(--foreground-muted)]">12 000+ учеников</span>
              </div>
              <div className="text-xs text-[var(--foreground-muted)]">уже с нами</div>
            </div>
          </div>
        </div>
        <div className="relative">
          <HeroDemo />
        </div>
      </div>
    </section>
  );
}
