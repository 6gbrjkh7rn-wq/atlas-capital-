import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="ml-64 flex min-h-screen flex-1 bg-[#fafaf8] pt-24 dark:bg-[#111214]">
      <div className="mx-auto w-full max-w-7xl px-8 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        {children}
      </div>
    </main>
  );
}
