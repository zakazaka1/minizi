import Link from "next/link";
import Image from "next/image";
import { googleAuthEnabled, signIn } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  async function loginWithGoogle() {
    "use server";
    await signIn("google", { redirectTo: "/learn" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-rice">
      <div className="card max-w-md w-full p-8 sm:p-10 flex flex-col items-center gap-6 text-center">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/icon.svg" alt="" width={36} height={36} />
          <span className="text-2xl font-display font-semibold tracking-tight">
            Minzi
          </span>
        </Link>
        <h1 className="text-2xl font-display font-medium">
          Войдите, чтобы сохранить прогресс
        </h1>
        <p className="text-[var(--foreground-muted)] text-sm max-w-sm">
          Вход через Google синхронизирует ваше изучение между устройствами.
          Без входа всё работает локально на этом устройстве.
        </p>

        {googleAuthEnabled ? (
          <form action={loginWithGoogle} className="w-full">
            <button type="submit" className="btn btn-primary w-full">
              Войти через Google
            </button>
          </form>
        ) : (
          <div className="card-soft p-4 text-sm text-[var(--foreground-muted)]">
            Google-вход не настроен. Добавьте{" "}
            <code className="px-1 bg-[var(--surface-2)] rounded">
              GOOGLE_CLIENT_ID
            </code>{" "}
            и{" "}
            <code className="px-1 bg-[var(--surface-2)] rounded">
              GOOGLE_CLIENT_SECRET
            </code>{" "}
            в .env, чтобы включить.
          </div>
        )}

        <Link href="/learn" className="btn btn-ghost text-sm">
          Продолжить как гость →
        </Link>
      </div>
    </div>
  );
}
