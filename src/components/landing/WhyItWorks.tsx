import Image from "next/image";
import { Brain, Eye, CalendarDays, Sprout } from "lucide-react";

const ITEMS = [
  {
    icon: Brain,
    title: "Вы пишете",
    body: "Движение рукой активирует моторную память.",
  },
  {
    icon: Eye,
    title: "Вы видите",
    body: "Визуальное восприятие помогает запомнить образ.",
  },
  {
    icon: CalendarDays,
    title: "Вы повторяете",
    body: "Алгоритм повторений закрепляет в нужное время.",
  },
  {
    icon: Sprout,
    title: "Вы запоминаете",
    body: "Информация переходит в долгосрочную память.",
  },
];

export function WhyItWorks() {
  return (
    <section className="relative py-14 sm:py-20 my-10 overflow-hidden">
      {/* Dark band */}
      <div className="absolute inset-0 bg-[#1a3f2a]">
        <Image
          src="/bg/bg_dark_bamboo.png"
          alt=""
          fill
          className="object-cover opacity-50 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3f2a]/95 to-[#1a3f2a]/55" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 items-center">
        <div className="flex items-center gap-6">
          <Image
            src="/panda/panda_studying.png"
            alt=""
            width={140}
            height={140}
            className="hidden md:block"
          />
          <h2 className="text-3xl sm:text-4xl font-display font-medium tracking-tight text-white">
            Почему это <br />
            <span className="text-[#a9d8b4]">работает</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-white/95">
          {ITEMS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex flex-col gap-2">
              <div className="h-11 w-11 rounded-full border border-white/30 flex items-center justify-center text-white/90">
                <Icon size={18} />
              </div>
              <div className="font-medium">{title}</div>
              <div className="text-sm text-white/70 leading-relaxed">{body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
