"use client";

import Link from "next/link";
import Image from "next/image";

const NAV: { href: string; label: string }[] = [
  { href: "#features", label: "Возможности" },
  { href: "#how", label: "Как это работает" },
  { href: "#testimonials", label: "Отзывы" },
  { href: "#pricing", label: "Тарифы" },
  { href: "#about", label: "О проекте" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 mr-2">
          <Image src="/icon.svg" alt="" width={32} height={32} />
          <div className="leading-tight">
            <div className="text-lg font-display font-semibold tracking-tight">
              Minzi
            </div>
            <div className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-[0.15em]">
              Учите иероглифы правильно
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--foreground-muted)]">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-[var(--foreground)] transition-colors">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/learn" className="btn btn-secondary h-10">
            Войти
          </Link>
          <Link href="/learn" className="btn btn-primary h-10 hidden sm:inline-flex">
            Начать учить правильно
          </Link>
        </div>
      </div>
    </header>
  );
}
