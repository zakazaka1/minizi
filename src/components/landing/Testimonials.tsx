const REVIEWS = [
  {
    name: "Анна",
    sub: "Учит китайский 6 месяцев",
    body: "Раньше постоянно забывала иероглифы. С Minzi наконец начала их писать и лучше понимать. Результат ощущается!",
  },
  {
    name: "Дмитрий",
    sub: "Учит китайский 1 год",
    body: "Очень нравится практика письма и подсказки по чертам. Чувствую, как растёт уверенность.",
  },
  {
    name: "Екатерина",
    sub: "Учит китайский 6 месяцев",
    body: "Удобные повторения — не надо думать, когда повторять, приложение само напоминает. Очень помогает!",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-display font-medium tracking-tight text-center mb-8">
          Что говорят ученики
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="card p-6 relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--surface-3)] to-[var(--surface-2)] border border-[var(--border)]" />
                <figcaption>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-[var(--foreground-muted)]">
                    {r.sub}
                  </div>
                </figcaption>
                <span className="ml-auto text-amber-500 text-sm">★★★★★</span>
              </div>
              <blockquote className="text-sm text-[var(--foreground)] leading-relaxed">
                {r.body}
              </blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
