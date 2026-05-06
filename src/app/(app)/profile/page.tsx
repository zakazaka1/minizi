"use client";

import Link from "next/link";
import { useProgress } from "@/store/progress";
import { useMounted } from "@/lib/useMounted";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Panda } from "@/components/ui/Panda";
import { StreakPill } from "@/components/ui/StreakPill";
import { Settings, Trash2, Award, Flame, Target, Clock } from "lucide-react";

export default function ProfilePage() {
  const chars = useProgress((s) => s.chars);
  const completed = useProgress((s) => s.completedLessons);
  const streak = useProgress((s) => s.streak);
  const reset = useProgress((s) => s.reset);

  const mounted = useMounted();
  if (!mounted) return null;

  const totalReviews = Object.values(chars).reduce(
    (s, c) => s + c.attempts,
    0
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
      <header className="flex items-center gap-5 mb-8">
        <Panda mood="hello" size={96} />
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--foreground-soft)] mb-1">
            Профиль
          </div>
          <h1 className="text-2xl font-display font-medium">Гость</h1>
          <div className="text-sm text-[var(--foreground-muted)] mt-1">
            Войдите через Google, чтобы синхронизировать прогресс между
            устройствами.
          </div>
        </div>
      </header>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Цели обучения</h2>
        <div className="grid grid-cols-2 gap-4">
          <Goal label="Ежедневная цель" icon={Target} value="20 иероглифов" />
          <Goal label="Ежедневное время" icon={Clock} value="20 минут" />
          <Goal label="Серия" icon={Flame} value={`${streak} дн.`} />
          <Goal label="Уроков пройдено" icon={Award} value={`${completed.length}`} />
        </div>
        <div className="flex items-center gap-3 mt-5 flex-wrap">
          <Link href="/login" className="btn btn-primary">
            Войти через Google
          </Link>
          {streak > 0 && <StreakPill count={streak} />}
          <span className="text-xs text-[var(--foreground-muted)] ml-auto">
            Всего ответов: {totalReviews}
          </span>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Settings size={16} /> Настройки
        </h2>
        <div className="text-sm text-[var(--foreground-muted)] mb-4">
          Прогресс гостя сохраняется только на этом устройстве (localStorage).
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            if (confirm("Удалить весь локальный прогресс?")) reset();
          }}
        >
          <Trash2 size={14} /> Сбросить прогресс
        </Button>
      </Card>
    </div>
  );
}

function Goal({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="card-soft p-4">
      <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-xs uppercase tracking-wider mb-2">
        <Icon size={14} />
        {label}
      </div>
      <div className="text-lg font-medium">{value}</div>
    </div>
  );
}
