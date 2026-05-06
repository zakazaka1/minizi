import { PenLine, Brush, RefreshCw, Trophy } from "lucide-react";

const ITEMS = [
  {
    icon: PenLine,
    title: "Пишите, а не просто смотрите",
    body: "Активное письмо задействует память сильнее, чем чтение.",
  },
  {
    icon: Brush,
    title: "Правильный порядок черт",
    body: "Анимации и подсказки учат писать точно и красиво.",
  },
  {
    icon: RefreshCw,
    title: "Умные повторения",
    body: "Повторяем в нужный момент, чтобы вы не забывали.",
  },
  {
    icon: Trophy,
    title: "Отслеживание прогресса",
    body: "Видите свой рост и знаете, над чем работать дальше.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ITEMS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="card p-6 flex flex-col gap-2.5">
            <div className="h-10 w-10 rounded-full bg-[var(--green-soft)] text-[var(--green-deep)] flex items-center justify-center">
              <Icon size={18} />
            </div>
            <h3 className="font-display font-medium text-lg">{title}</h3>
            <p className="text-sm text-[var(--foreground-muted)]">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
