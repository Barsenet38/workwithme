"use client";

import Link from "next/link";
import { useParams, useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { 
  Home, Users, Settings, FileText, 
  Calendar, DollarSign, BarChart3, 
  LogOut, User, Shield, Briefcase,
  Hexagon
} from "lucide-react";

interface UserData {
  role: string;
  name: string;
}

export default function Sidebar() {
  const { company } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth");
  };

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 bg-slate-900/80 backdrop-blur-sm text-slate-100 min-h-screen p-4 border-r border-slate-700/50">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-lg"></div>
            <div className="relative bg-slate-800/80 backdrop-blur-sm p-2 rounded-xl border border-slate-700/50">
              <Hexagon className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold ml-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {company}
          </h2>
        </div>
        <p className="text-sm text-slate-400">Welcome back,</p>
        <p className="text-cyan-300 font-semibold">{user.name}</p>
        <p className="text-xs text-slate-500 capitalize mt-1 bg-slate-800/50 px-2 py-1 rounded-full inline-block">
          {user.role.toLowerCase()}
        </p>
      </div>

      <nav className="space-y-1">
        {/* Common Navigation */}
        <Link 
          href={`/${company}/dashboard`}
          className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
            isActive(`/${company}/dashboard`) 
              ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
              : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
          }`}
        >
          <Home className="h-4 w-4 mr-3" />
          Dashboard
        </Link>

        {/* Admin & HR Navigation */}
        {(user.role === "ADMIN" || user.role === "HR") && (
          <>
            <Link 
              href={`/${company}/hr/employees`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                isActive(`/${company}/hr/employees`) 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <Users className="h-4 w-4 mr-3" />
              Employees
            </Link>
            <Link 
              href={`/${company}/hr/payroll`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                isActive(`/${company}/hr/payroll`) 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <DollarSign className="h-4 w-4 mr-3" />
              Payroll
            </Link>
          </>
        )}

        {/* Admin Only Navigation */}
        {user.role === "ADMIN" && (
          <>
            <Link 
              href={`/${company}/admin/users`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                isActive(`/${company}/admin/users`) 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <Shield className="h-4 w-4 mr-3" />
              User Management
            </Link>
            <Link 
              href={`/${company}/admin/settings`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                isActive(`/${company}/admin/settings`) 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Link>
          </>
        )}

        {/* Manager Navigation */}
        {(user.role === "ADMIN" || user.role === "HR" || user.role === "MANAGER") && (
          <>
            <Link 
              href={`/${company}/manager/team`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                isActive(`/${company}/manager/team`) 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <Briefcase className="h-4 w-4 mr-3" />
              Team Management
            </Link>
            <Link 
              href={`/${company}/manager/approvals`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                isActive(`/${company}/manager/approvals`) 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <FileText className="h-4 w-4 mr-3" />
              Approvals
            </Link>
          </>
        )}

        {/* Employee Navigation */}
        <Link 
          href={`/${company}/employee/profile`}
          className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
            isActive(`/${company}/employee/profile`) 
              ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
              : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
          }`}
        >
          <User className="h-4 w-4 mr-3" />
          My Profile
        </Link>

        <Link 
          href={`/${company}/employee/leave`}
          className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
            isActive(`/${company}/employee/leave`) 
              ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
              : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
          }`}
        >
          <Calendar className="h-4 w-4 mr-3" />
          Leave Requests
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full py-3 px-4 rounded-lg hover:bg-red-600/20 hover:text-red-300 border border-transparent hover:border-red-500/30 transition-all duration-200 mt-8 text-slate-400"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </button>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-xs text-slate-500 text-center">
          <p>HR System v4.2</p>
          <p>Secure • Reliable • Efficient</p>
        </div>
      </div>
    </div>
  );
}