
"use client";

import Link from "next/link";
import { useParams, useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { 
  Home, Users, Settings, FileText, 
  Calendar, DollarSign, BarChart3, 
  LogOut, User, Shield, Briefcase,
  Hexagon, CreditCard, GitMerge, BarChart,
  Search, ChevronDown, Key
} from "lucide-react";
import { JwtPayload } from '@/types/user';

interface SidebarUserData {
  role: string;
  name: string;
}

export default function Sidebar() {
  const { company } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SidebarUserData | null>(null);
  const [isSuperadminMenuOpen, setIsSuperadminMenuOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
        setUser({
          role: decoded.role,
          name: decoded.name
        });
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    router.push("/auth");
  };

  const isActive = (path: string): boolean => pathname === path;

  const toggleSuperadminMenu = () => {
    setIsSuperadminMenuOpen(!isSuperadminMenuOpen);
  };

  if (!user) return null;

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
            {user.role === "SUPERADMIN" ? "Platform Admin" : company}
          </h2>
        </div>
        <p className="text-sm text-slate-400">Welcome back,</p>
        <p className="text-cyan-300 font-semibold">{user.name}</p>
        <p className="text-xs text-slate-500 capitalize mt-1 bg-slate-800/50 px-2 py-1 rounded-full inline-block">
          {user.role.toLowerCase()}
        </p>
      </div>

      <nav className="space-y-1">
        {/* Search Bar for Superadmin */}
        {user.role === "SUPERADMIN" && (
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2 px-4 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>
        )}

        {/* Superadmin Navigation */}
        {user.role === "SUPERADMIN" && (
          <>
            <button
              onClick={toggleSuperadminMenu}
              className="flex items-center w-full py-3 px-4 rounded-lg transition-all duration-200 hover:bg-slate-800/50 hover:text-cyan-300"
            >
              <Shield className="h-4 w-4 mr-3" />
              Superadmin Controls
              <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${isSuperadminMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {isSuperadminMenuOpen && (
              <div className="pl-4 space-y-1">
                <Link 
                  href="/superadmin/dashboard"
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                    isActive("/superadmin/dashboard") 
                      ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                      : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
                  }`}
                >
                  <Home className="h-4 w-4 mr-3" />
                  Dashboard
                </Link>
                <Link 
                  href="/superadmin/tenants"
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                    isActive("/superadmin/tenants") 
                      ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                      : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
                  }`}
                >
                  <Users className="h-4 w-4 mr-3" />
                  Tenant Management
                </Link>
                <Link 
                  href="/superadmin/billing"
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                    isActive("/superadmin/billing") 
                      ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                      : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
                  }`}
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Global Billing
                </Link>
                <Link 
                  href="/superadmin/monitoring"
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                    isActive("/superadmin/monitoring") 
                      ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                      : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
                  }`}
                >
                  <BarChart3 className="h-4 w-4 mr-3" />
                  System Monitoring
                </Link>
                <Link 
                  href="/superadmin/audit-logs"
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                    isActive("/superadmin/audit-logs") 
                      ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                      : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
                  }`}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Audit Logs
                </Link>
                <Link 
                  href="/superadmin/api-management"
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                    isActive("/superadmin/api-management") 
                      ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                      : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
                  }`}
                >
                  <Key className="h-4 w-4 mr-3" />
                  API Management
                </Link>
                <Link 
                  href="/superadmin/settings"
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                    isActive("/superadmin/settings") 
                      ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                      : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
                  }`}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Platform Settings
                </Link>
                <Link 
                  href="/superadmin/profile"
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                    isActive("/superadmin/profile") 
                      ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                      : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
                  }`}
                >
                  <User className="h-4 w-4 mr-3" />
                  My Profile
                </Link>
              </div>
            )}
          </>
        )}

        {/* Common Navigation */}
        {user.role !== "SUPERADMIN" && (
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
        )}

        {/* Admin Navigation */}
        {(user.role === "ADMIN") && (
          <>
            <Link 
              href={`/${company}/admin/dashboard`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                pathname?.includes('/admin') 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <Shield className="h-4 w-4 mr-3" />
              Admin Dashboard
            </Link>
            <Link 
              href={`/${company}/admin/users`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                isActive(`/${company}/admin/users`) 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <Users className="h-4 w-4 mr-3" />
              User Management
            </Link>
            <Link 
              href={`/${company}/admin/billing`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                isActive(`/${company}/admin/billing`) 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <CreditCard className="h-4 w-4 mr-3" />
              Billing
            </Link>
            <Link 
              href={`/${company}/admin/integrations`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                isActive(`/${company}/admin/integrations`) 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <GitMerge className="h-4 w-4 mr-3" />
              Integrations
            </Link>
            <Link 
              href={`/${company}/admin/reports`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                isActive(`/${company}/admin/reports`) 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <BarChart className="h-4 w-4 mr-3" />
              Reports
            </Link>
            <Link 
              href={`/${company}/admin/security`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                isActive(`/${company}/admin/security`) 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <Shield className="h-4 w-4 mr-3" />
              Security
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

        {/* HR Navigation */}
        {(user.role === "ADMIN" || user.role === "HR") && (
          <>
            <Link 
              href={`/${company}/hr/employees`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                pathname?.includes('/hr/employees') 
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
                pathname?.includes('/hr/payroll') 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <DollarSign className="h-4 w-4 mr-3" />
              Payroll
            </Link>
            <Link 
              href={`/${company}/hr/attendance`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                pathname?.includes('/hr/attendance') 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <Calendar className="h-4 w-4 mr-3" />
              Attendance
            </Link>
            <Link 
              href={`/${company}/hr/recruitment`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                pathname?.includes('/hr/recruitment') 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <Briefcase className="h-4 w-4 mr-3" />
              Recruitment
            </Link>
          </>
        )}

        {/* Manager Navigation */}
        {(user.role === "ADMIN" || user.role === "HR" || user.role === "MANAGER") && (
          <>
            <Link 
              href={`/${company}/manager/team`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                pathname?.includes('/manager/team') 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <Users className="h-4 w-4 mr-3" />
              Team Management
            </Link>
            <Link 
              href={`/${company}/manager/approvals`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                pathname?.includes('/manager/approvals') 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <FileText className="h-4 w-4 mr-3" />
              Approvals
            </Link>
            <Link 
              href={`/${company}/manager/performance`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                pathname?.includes('/manager/performance') 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <BarChart3 className="h-4 w-4 mr-3" />
              Performance
            </Link>
          </>
        )}

        {/* Employee Navigation */}
        {user.role !== "SUPERADMIN" && (
          <>
            <Link 
              href={`/${company}/${user.role.toLowerCase()}/profile`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                pathname?.includes('/profile') 
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
                pathname?.includes('/employee/leave') 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <Calendar className="h-4 w-4 mr-3" />
              Leave Requests
            </Link>
            <Link 
              href={`/${company}/employee/payroll`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                pathname?.includes('/employee/payroll') 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <DollarSign className="h-4 w-4 mr-3" />
              My Payroll
            </Link>
            <Link 
              href={`/${company}/employee/documents`}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                pathname?.includes('/employee/documents') 
                  ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30" 
                  : "hover:bg-slate-800/50 hover:text-cyan-300 border border-transparent"
              }`}
            >
              <FileText className="h-4 w-4 mr-3" />
              Documents
            </Link>
          </>
        )}

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
