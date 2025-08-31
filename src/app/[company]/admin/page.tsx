"use client";

import { useEffect, useState } from "react";
import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/Card";
import {
  Users,
  CreditCard,
  Settings,
  BarChart3,
  Shield,
  GitMerge,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardData {
  totalEmployees: number;
  totalManagers: number;
  performanceSummary: {
    _avg: { rating: number | null };
    _count: { id: number };
  };
  performanceDistribution: { rating: number | null; _count: { rating: number } }[];
  employeesByDept: { departmentId: string | null; _count: { id: number } }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/dashboard") // ✅ match backend
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Dashboard fetch error:", err));
  }, []);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <RoleLayout allowedRoles={["ADMIN"]}>
      <MainLayout
        title="Admin Dashboard"
        description="Company administration and system management"
      >
        <div className="p-8">
          {/* ==== TOP CARDS ==== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="text-center hover:border-cyan-500/30 transition-all duration-300">
              <Users className="h-12 w-12 text-cyan-400 mx-auto mb-3" />
              <h3 className="font-semibold text-cyan-300">
                {data ? data.totalEmployees : "--"}
              </h3>
              <p className="text-slate-400">Total Employees</p>
            </Card>

            <Card className="text-center hover:border-blue-500/30 transition-all duration-300">
              <CreditCard className="h-12 w-12 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-300">
                {data ? data.totalManagers : "--"}
              </h3>
              <p className="text-slate-400">Team Managers</p>
            </Card>

            <Card className="text-center hover:border-green-500/30 transition-all duration-300">
              <Settings className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-green-300">
                {data?.performanceSummary._avg.rating?.toFixed(1) ?? "--"}
              </h3>
              <p className="text-slate-400">Avg Performance Rating</p>
            </Card>

            <Card className="text-center hover:border-purple-500/30 transition-all duration-300">
              <BarChart3 className="h-12 w-12 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-300">
                {data ? data.performanceSummary._count.id : "--"}
              </h3>
              <p className="text-slate-400">Total Reviews</p>
            </Card>

            <Card className="text-center hover:border-orange-500/30 transition-all duration-300">
              <GitMerge className="h-12 w-12 text-orange-400 mx-auto mb-3" />
              <h3 className="font-semibold text-orange-300">
                {data ? data.employeesByDept.length : "--"}
              </h3>
              <p className="text-slate-400">Departments</p>
            </Card>

            <Card className="text-center hover:border-red-500/30 transition-all duration-300">
              <Shield className="h-12 w-12 text-red-400 mx-auto mb-3" />
              <h3 className="font-semibold text-red-300">Security</h3>
              <p className="text-slate-400">Access control & policies</p>
            </Card>
          </div>

          {/* ==== CHARTS ==== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Employees by Department (Bar) */}
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4 text-slate-200">
                Employees by Department
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.employeesByDept || []}>
                  <XAxis dataKey="departmentId" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="_count.id" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Performance Distribution (Pie) */}
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4 text-slate-200">
                Performance Rating Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data?.performanceDistribution || []}
                    dataKey="_count.rating"
                    nameKey="rating"
                    outerRadius={120}
                    label
                  >
                    {(data?.performanceDistribution || []).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </MainLayout>
    </RoleLayout>
  );
}
