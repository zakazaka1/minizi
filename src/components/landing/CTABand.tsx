import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CreditCard, CheckCircle2, Zap } from "lucide-react";

export function CTABand() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="card relative overflow-hidden p-7 sm:p-9 flex flex-col md:flex-row items-center gap-6">
          <Image
            src="/bg/bg_mountain_sun.png"
            alt=""
            width={500}
            height={300}
            className="absolute inset-y-0 right-0 h-full w-auto opacity-30 pointer-events-none"
          />
          <div className="relative flex-1">
            <h3 className="text-2xl sm:text-3xl font-display font-medium tracking-tight">
              Начните учить иероглифы <br />
              <span className="text-[var(--green-deep)]">правильно</span>{" "}
              уже сегодня
            </h3>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-[var(--foreground-muted)]">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[var(--green)]" /> Бесплатно
              </li>
              <li className="flex items-center gap-2">
                <CreditCard size={16} className="text-[var(--green)]" /> Без карты
              </li>
              <li className="flex items-center gap-2">
                <Zap size={16} className="text-[var(--green)]" /> Доступно сразу
              </li>
            </ul>
          </div>
          <Link href="/learn" className="relative btn btn-primary h-12 px-6">
            Начать учить правильно <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
