import type { ReactNode } from "react";

import { PageContainer } from "./PageContainer";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

type AppShellProps = {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
};

export function AppShell({ children, title = "Dashboard", action }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-[#111214]">
      <Sidebar activeItem={title} />
      <TopBar title={title} action={action} />
      <PageContainer>{children}</PageContainer>
    </div>
  );
}
