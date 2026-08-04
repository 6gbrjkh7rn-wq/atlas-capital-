import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "neutral";

type KPICardProps = {
  title: string;
  value: string;
  change: string;
  trend: Trend;
  icon: LucideIcon;
  emphasized?: boolean;
};

const trendStyles: Record<Trend, string> = {
  up: "text-emerald-700 dark:text-emerald-400",
  down: "text-rose-700 dark:text-rose-400",
  neutral: "text-neutral-500 dark:text-neutral-400",
};

export function KPICard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  emphasized = false,
}: KPICardProps) {
  return (
    <section
      className={cn(
        "group rounded-xl border p-7 transition-[border-color,background-color,transform] duration-300 ease-out hover:-translate-y-0.5",
        emphasized
          ? "border-neutral-300 bg-white hover:border-neutral-400 dark:border-white/20 dark:bg-neutral-950 dark:hover:border-white/30"
          : "border-neutral-200/80 bg-white/70 hover:border-neutral-300 hover:bg-white dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-white/[0.16] dark:hover:bg-white/[0.05]",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium tracking-[-0.01em] text-neutral-500 dark:text-neutral-400">
          {title}
        </p>
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-lg border transition-colors duration-300",
            emphasized
              ? "border-neutral-200 bg-neutral-50 text-neutral-800 group-hover:bg-neutral-100 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:group-hover:bg-white/[0.1]"
              : "border-neutral-200/80 text-neutral-500 group-hover:text-neutral-800 dark:border-white/[0.08] dark:text-neutral-400 dark:group-hover:text-white",
          )}
        >
          <Icon className="size-4" strokeWidth={1.6} aria-hidden="true" />
        </span>
      </div>
      <p
        className={cn(
          "mt-8 font-medium tracking-[-0.05em] text-neutral-950 dark:text-white",
          emphasized ? "text-4xl sm:text-[2.75rem]" : "text-3xl",
        )}
      >
        {value}
      </p>
      <p className={cn("mt-3 text-sm font-medium", trendStyles[trend])}>
        {change}
      </p>
    </section>
  );
}
