import Image from "next/image";

export function StreakPill({ count }: { count: number }) {
  return (
    <span className="streak-pill">
      <Image
        src="/fire/fire_3.png"
        alt=""
        width={18}
        height={20}
        className="-translate-y-px"
      />
      {count}
    </span>
  );
}
