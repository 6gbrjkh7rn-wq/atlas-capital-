import Link from "next/link";

const navigationItems = [
  { label: "Dashboard", href: "/" },
  { label: "Portfolio" },
  { label: "Assets", href: "/assets" },
  { label: "Decision Engine" },
  { label: "Analytics" },
  { label: "Timeline" },
  { label: "Documents" },
  { label: "Settings" },
];

type SidebarProps = {
  activeItem: string;
};

export function Sidebar({ activeItem }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/[0.08] bg-[#17181a] px-5 py-7 text-white">
      <div className="px-3 text-[0.7rem] font-semibold tracking-[0.2em] text-white/95">
        ATLAS Capital
      </div>

      <nav className="mt-14" aria-label="Primary navigation">
        <ul className="space-y-1.5">
          {navigationItems.map((item) => {
            const isActive = item.label === activeItem;
            const className = `block rounded-lg px-3 py-2.5 text-sm tracking-[-0.01em] transition-colors duration-200 ${
              isActive
                ? "bg-white/[0.08] font-medium text-white"
                : "text-white/50 hover:bg-white/[0.05] hover:text-white/80"
            }`;

            return (
              <li key={item.label}>
                {item.href ? (
                  <Link href={item.href} className={className}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={className}>{item.label}</span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
