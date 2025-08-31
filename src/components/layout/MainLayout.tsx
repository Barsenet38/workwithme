"use client";

import { ReactNode } from "react";
import ParticleBackground from "../background/ParticleBackground";
import { Hexagon, Cpu, Database } from "lucide-react";
import DashboardHeader from "./DashboardHeader";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
}

export default function MainLayout({
  children,
  title = "HR SYSTEM",
  description = "Human Resources Management Portal",
  showHeader = true,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden ">
      <ParticleBackground />
      <DashboardHeader />
      <div className="container mx-auto p-4 relative z-10 flex items-center justify-center min-h-screen">
        <div className="p-4 relative z-10 flex flex-col min-h-screen w-full">


  <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden w-full">
    {children}
  </div>

  <div className="mt-8 text-center w-full">
    <div className="inline-flex items-center space-x-6 text-slate-500">
      <div className="flex items-center text-xs">
        <Cpu className="h-3 w-3 mr-1 text-cyan-500" />
        <span>Encrypted Connection</span>
      </div>
      <div className="flex items-center text-xs">
        <Database className="h-3 w-3 mr-1 text-cyan-500" />
        <span>HR Database v4.2</span>
      </div>
    </div>
  </div>
</div>

      </div>
    </div>
  );
}