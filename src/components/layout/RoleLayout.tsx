"use client";

import { ReactNode } from "react";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import Sidebar from "./Sidebar";
import ParticleBackground from "../background/ParticleBackground";

interface RoleLayoutProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function RoleLayout({ children, allowedRoles }: RoleLayoutProps) {
  const { isLoading, isAuthorized } = useRoleGuard(allowedRoles);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden">
        <ParticleBackground />
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-4 text-slate-400">Checking permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Redirect will happen automatically
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden">
      <ParticleBackground />
      <Sidebar />
      <main className="flex-1 p-6 relative z-10">
        {children}
      </main>
    </div>
  );
}