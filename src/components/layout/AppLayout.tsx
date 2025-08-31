"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar"; // We'll move your Sidebar component here

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}