"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/types/user";

interface UserData {
  name: string;
  role: string;
}

export default function DashboardHeader() {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
        setUser({
          name: decoded.name,
          role: decoded.role,
        });
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        router.push("/auth");
      }
    } else {
      router.push("/auth"); // Redirect if no token
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth");
  };

  if (!user) return null;

  return (
    <div className="mb-8 bg-slate-900/40 border border-slate-700/50 p-6 rounded-2xl shadow-md flex justify-between items-center">
      <div>
        <p className="text-sm text-slate-400">Welcome back,</p>
        <h1 className="text-2xl font-bold text-cyan-400">{user.name}</h1>
        <p className="text-xs text-slate-500 capitalize mt-2 bg-slate-800/60 px-3 py-1 rounded-full inline-block">
          {user.role.toLowerCase()}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-200"
      >
        Logout
      </button>
    </div>
  );
}
