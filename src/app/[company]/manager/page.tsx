"use client";

import { useEffect, useState } from "react";
import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Users, Calendar, CheckCircle, BarChart3, Target, Clock } from "lucide-react";
import clsx from "clsx";

import { jwtDecode } from "jwt-decode";

const colorMap: Record<string, { bg: string; text: string }> = {
  cyan: { bg: "bg-cyan-600/20", text: "text-cyan-400" },
  green: { bg: "bg-green-600/20", text: "text-green-400" },
  blue: { bg: "bg-blue-600/20", text: "text-blue-400" },
  purple: { bg: "bg-purple-600/20", text: "text-purple-400" },
};

// Dashboard types
interface DashboardData {
  teamOverview: {
    teamSize: number;
    presentToday: number;
    pendingApprovals: number;
    averagePerformance: number;
  };
  pendingLeaveRequests: Array<{
    id: string;
    employeeName: string;
    leaveType: { name: string; color: string };
    startDate: string;
    endDate: string;
    duration: number;
  }>;
  performanceBreakdown: Array<{
    metric: string;
    value: number;
    color: string;
  }>;
  quickActions: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
    color: string;
  }>;
}

export default function ManagerDashboard() {
  const [mounted, setMounted] = useState(false); // ✅ hydration-safe
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format date consistently
  const formatDate = (date: string) => new Date(date).toISOString().split("T")[0];

  useEffect(() => {
    setMounted(true);

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        // Decode token to get companyId and managerId
        const decoded: { companyId: string; userId: string } = jwtDecode(token);
        const companyId = decoded.companyId;
        const managerId = decoded.userId; // manager's userId

        const response = await fetch(
          `http://localhost:5000/manager/managerdashboard?companyId=${companyId}&managerId=${managerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error("Failed to fetch dashboard data");

        const result = await response.json();
        console.log("Dashboard data:", result); // ✅ See it in browser console
        console.log("CompanyId:", companyId, "ManagerId:", managerId);

        setData(result.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  // Avoid SSR mismatch
  if (!mounted) return null;

  if (loading) {
    return (
      <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
        <MainLayout title="Manager Dashboard" description="Team overview" showHeader>
          <div className="p-8 animate-pulse space-y-8">
            <div className="h-24 bg-slate-800 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-800 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-slate-800 rounded-lg"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-slate-800 rounded-lg"></div>
              <div className="h-80 bg-slate-800 rounded-lg"></div>
            </div>
          </div>
        </MainLayout>
      </RoleLayout>
    );
  }

  if (error) {
    return (
      <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
        <MainLayout title="Manager Dashboard" description="Team overview" showHeader>
          <div className="p-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-8 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white"
              >
                Retry
              </button>
            </div>
          </div>
        </MainLayout>
      </RoleLayout>
    );
  }

  return (
    <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
      <MainLayout title="Manager Dashboard" description="Team overview" showHeader>
        <div className="p-8 space-y-8">
          {/* Team Overview */}
          <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-cyan-500/20 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-cyan-300 mb-2">Team Overview</h2>
                <p className="text-slate-400">
                  Managing {data?.teamOverview.teamSize || 0} team members
                  {data?.teamOverview.pendingApprovals
                    ? ` with ${data.teamOverview.pendingApprovals} pending approvals`
                    : ""}
                </p>
              </div>
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-cyan-400" />
              </div>
            </div>
          </Card>

          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Team Size",
                value: data?.teamOverview.teamSize || 0,
                icon: <Users className="h-6 w-6 text-cyan-400" />,
                color: "cyan",
                subtitle: "Members",
              },
              {
                title: "Present Today",
                value: data?.teamOverview.presentToday || 0,
                icon: <CheckCircle className="h-6 w-6 text-green-400" />,
                color: "green",
                subtitle: "Team Members",
              },
              {
                title: "Pending Approval",
                value: data?.teamOverview.pendingApprovals || 0,
                icon: <Calendar className="h-6 w-6 text-blue-400" />,
                color: "blue",
                subtitle: "Leave Requests",
              },
              {
                title: "Team Performance",
                value: data?.teamOverview.averagePerformance || 0,
                icon: <Target className="h-6 w-6 text-purple-400" />,
                color: "purple",
                subtitle: "This Month",
              },
            ].map((stat, idx) => {
              const c = colorMap[stat.color] || colorMap.cyan;
              return (
                <Card
                  key={idx}
                  className={clsx(
                    "text-center transition-all duration-300 hover:scale-105",
                    `hover:border-${stat.color}-500/30`
                  )}
                >
                  <div className={clsx("mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3", c.bg)}>
                    {stat.icon}
                  </div>
                  <h3 className={clsx("font-semibold mb-1", c.text)}>{stat.title}</h3>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.subtitle}</p>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <h3 className="text-xl font-semibold text-cyan-300 mb-6 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Management Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data?.quickActions.map((action) => {
                const c = colorMap[action.color] || colorMap.cyan;
                return (
                  <button
                    key={action.id}
                    className={`p-4 rounded-lg bg-slate-700/50 hover:${c.bg} border border-slate-600/50 hover:border-${action.color}-500/30 transition-all duration-300 group text-left`}
                  >
                    <div className={`h-8 w-8 mb-2`}>
                      {action.icon === "Users" && <Users className={`h-8 w-8 ${c.text}`} />}
                      {action.icon === "Calendar" && <Calendar className={`h-8 w-8 ${c.text}`} />}
                      {action.icon === "BarChart3" && <BarChart3 className={`h-8 w-8 ${c.text}`} />}
                      {action.icon === "Target" && <Target className={`h-8 w-8 ${c.text}`} />}
                    </div>
                    <h4 className="font-semibold text-white">{action.title}</h4>
                    <p className="text-slate-400 text-sm">{action.description}</p>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Team Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Approvals */}
            <Card>
              <h3 className="text-xl font-semibold text-cyan-300 mb-6">Pending Approvals</h3>
              <div className="space-y-3">
                {data?.pendingLeaveRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-green-500/30 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                        <Calendar className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{request.employeeName}</p>
                        <p className={`text-sm ${request.leaveType.color ? `text-${request.leaveType.color}-400` : "text-slate-400"}`}>
                          {formatDate(request.startDate)} • {request.leaveType.name}
                        </p>
                      </div>
                    </div>
                    <span className="text-green-400 text-sm">{request.duration} days</span>
                  </div>
                ))}

                {!data?.pendingLeaveRequests?.length && (
                  <p className="text-slate-400 text-center py-4">No pending approvals</p>
                )}
              </div>
            </Card>

            {/* Performance Breakdown */}
            <Card>
              <h3 className="text-xl font-semibold text-cyan-300 mb-6">Team Performance</h3>
              <div className="space-y-4">
                {data?.performanceBreakdown.map((metric, index) => {
                  const c = colorMap[metric.color] || colorMap.cyan;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-slate-300">{metric.metric}</span>
                      <div className="w-32 bg-slate-700 rounded-full h-2">
                        <div className={clsx(c.bg, "h-2 rounded-full")} style={{ width: `${metric.value}%` }}></div>
                      </div>
                      <span className={clsx(c.text)}>{metric.value}%</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </MainLayout>
    </RoleLayout>
  );
}
