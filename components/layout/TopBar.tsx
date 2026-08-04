import type { ReactNode } from "react";

type TopBarProps = {
  title: string;
  action?: ReactNode;
};

export function TopBar({ title, action }: TopBarProps) {
  return (
    <header className="fixed top-0 right-0 left-64 z-20 flex h-24 items-center justify-between border-b border-neutral-200/70 bg-[#fafaf8]/90 px-8 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#111214]/90">
      <h1 className="text-xl font-medium tracking-[-0.035em] text-[#171719] dark:text-white">
        {title}
      </h1>
      {action}
    </header>
  );
}
