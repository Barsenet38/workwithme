"use client";

import { ReactNode } from "react";
import ParticleBackground from "../background/ParticleBackground";
import { Hexagon, Cpu, Database } from "lucide-react";
// import DashboardHeader from "./DashboardHeader";

interface MainLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
    showHeader?: boolean;
}

export default function LoginLayout({
    children,
    title = "HR SYSTEM",
    description = "Human Resources Management Portal",
    showHeader = true,
}: MainLayoutProps) {
    return (
        <div className="bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden ">
            <ParticleBackground />
            <br /><br /><br />
            <div className="relative z-10 flex flex-col">

                {showHeader && (
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl"></div>
                                <div className="relative bg-slate-900/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50">
                                    <Hexagon className="h-10 w-10 text-cyan-500" />
                                </div>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                            {title}
                        </h1>
                        <p className="text-slate-400">{description}</p>
                    </div>
                )}

            </div>
            <div className="container mx-auto relative flex items-center justify-center">
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