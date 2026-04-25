import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function AppLayout({ children }: Props) {
  return (
    <main className="min-h-screen bg-[#f6f6f7]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </div>
    </main>
  );
}