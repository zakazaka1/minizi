"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  GraduationCap,
  Repeat,
  Book,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { StreakPill } from "@/components/ui/StreakPill";
import { useProgress } from "@/store/progress";
import { useMounted } from "@/lib/useMounted";

const NAV = [
  { href: "/learn", label: "Изучение", icon: GraduationCap },
  { href: "/review", label: "Повторение", icon: Repeat },
  { href: "/dictionary", label: "Словарь", icon: Book },
  { href: "/stats", label: "Статистика", icon: BarChart3 },
  { href: "/profile", label: "Профиль", icon: User },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const streak = useProgress((s) => s.streak);
  const mounted = useMounted();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm sticky top-0 h-screen p-5 gap-3">
      <Link href="/" className="flex items-center gap-2.5 mb-4">
        <Image src="/icon.svg" alt="" width={32} height={32} />
        <span className="text-xl font-display font-semibold tracking-tight">
          Minzi
        </span>
      </Link>
      <nav className="flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm transition-colors",
                active
                  ? "bg-[var(--green-soft)] text-[var(--green-deep)] font-medium"
                  : "text-[var(--foreground-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-3">
        {mounted && streak > 0 && (
          <div className="flex items-center justify-between px-3">
            <span className="text-xs text-[var(--foreground-muted)]">
              Серия
            </span>
            <StreakPill count={streak} />
          </div>
        )}
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm text-[var(--foreground-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
        >
          <LogOut size={16} /> Выйти
        </Link>
      </div>
    </aside>
  );
}
