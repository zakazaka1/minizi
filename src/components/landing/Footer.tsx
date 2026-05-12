import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-6 items-start text-sm text-[var(--foreground-muted)]">
        <div>
          <Link href="/" className="flex items-center gap-2.5 mb-3">
            <Image src="/icon.svg" alt="" width={28} height={28} />
            <span className="text-base font-display font-semibold tracking-tight text-[var(--foreground)]">
              Minzi
            </span>
          </Link>
          <p>
            © 2026 Minzi. Учите китайские иероглифы через письмо и понимание.
          </p>
        </div>
        <nav className="flex flex-col gap-2">
          <Link href="#" className="hover:text-[var(--foreground)]">Политика конфиденциальности</Link>
          <Link href="#" className="hover:text-[var(--foreground)]">Условия использования</Link>
          <Link href="#" className="hover:text-[var(--foreground)]">Связаться с нами</Link>
        </nav>
        <div className="text-xs text-[var(--foreground-soft)]">
          Данные иероглифов: HSK 3.0, Hanzi Writer, MakeMeAHanzi, CC-CEDICT.
        </div>
      </div>
    </footer>
  );
}
