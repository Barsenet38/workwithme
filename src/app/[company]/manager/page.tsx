"use client";

import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/Card";
import { Users, Calendar, CheckCircle, BarChart3, Target, Clock } from "lucide-react";
import { useEffect, useState } from "react";

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
    leaveType: string;
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
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await fetch('http://localhost:5000/manager/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
        <MainLayout 
          title="Manager Dashboard" 
          description="Team leadership and performance overview"
          showHeader={true}
        >
          <div className="p-8">
            <div className="animate-pulse">
              <div className="h-24 bg-slate-800 rounded-lg mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-slate-800 rounded-lg"></div>
                ))}
              </div>
              <div className="h-64 bg-slate-800 rounded-lg mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80 bg-slate-800 rounded-lg"></div>
                <div className="h-80 bg-slate-800 rounded-lg"></div>
              </div>
            </div>
          </div>
        </MainLayout>
      </RoleLayout>
    );
  }

  if (error) {
    return (
      <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
        <MainLayout 
          title="Manager Dashboard" 
          description="Team leadership and performance overview"
          showHeader={true}
        >
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
      <MainLayout 
        title="Manager Dashboard" 
        description="Team leadership and performance overview"
        showHeader={true}
      >
        <div className="p-8">
          {/* Team Overview Header */}
          <Card className="mb-8 bg-gradient-to-r from-slate-800 to-slate-900 border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-cyan-300 mb-2">Team Overview</h2>
                <p className="text-slate-400">
                  Managing {data?.teamOverview.teamSize || 0} team members
                  {data?.pendingApprovals ? ` with ${data.pendingApprovals} pending approvals` : ''}
                </p>
              </div>
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-cyan-400" />
              </div>
            </div>
          </Card>

          {/* Team Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="text-center hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-cyan-300 mb-1">Team Size</h3>
              <p className="text-2xl font-bold text-white">{data?.teamOverview.teamSize || 0}</p>
              <p className="text-slate-400 text-sm">Members</p>
            </Card>
            
            <Card className="text-center hover:border-green-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-green-300 mb-1">Present Today</h3>
              <p className="text-2xl font-bold text-white">{data?.teamOverview.presentToday || 0}</p>
              <p className="text-slate-400 text-sm">Team Members</p>
            </Card>
            
            <Card className="text-center hover:border-blue-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-blue-300 mb-1">Pending Approval</h3>
              <p className="text-2xl font-bold text-white">{data?.teamOverview.pendingApprovals || 0}</p>
              <p className="text-slate-400 text-sm">Leave Requests</p>
            </Card>
            
            <Card className="text-center hover:border-purple-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-3">
                <Target className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-purple-300 mb-1">Team Performance</h3>
              <p className="text-2xl font-bold text-white">{data?.teamOverview.averagePerformance || 0}%</p>
              <p className="text-slate-400 text-sm">This Month</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <h3 className="text-xl font-semibold text-cyan-300 mb-6 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Management Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data?.quickActions.map((action) => (
                <button
                  key={action.id}
                  className={`bg-slate-700/50 hover:bg-${action.color}-600/20 border border-slate-600/50 hover:border-${action.color}-500/30 p-4 rounded-lg transition-all duration-300 group`}
                >
                  {/* You would need to dynamically render the icon based on action.icon */}
                  <div className={`h-8 w-8 text-${action.color}-400 mb-2 group-hover:scale-110 transition-transform`}>
                    {action.icon === 'Users' && <Users className="h-8 w-8" />}
                    {action.icon === 'Calendar' && <Calendar className="h-8 w-8" />}
                    {action.icon === 'BarChart3' && <BarChart3 className="h-8 w-8" />}
                    {action.icon === 'Target' && <Target className="h-8 w-8" />}
                  </div>
                  <h4 className={`font-semibold text-white group-hover:text-${action.color}-300`}>
                    {action.title}
                  </h4>
                  <p className="text-slate-400 text-sm">{action.description}</p>
                </button>
              ))}
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
                        <p className="text-slate-400 text-sm">
                          {new Date(request.startDate).toLocaleDateString()} • {request.leaveType}
                        </p>
                      </div>
                    </div>
                    <span className="text-green-400 text-sm">{request.duration} days</span>
                  </div>
                ))}
                {(!data?.pendingLeaveRequests || data.pendingLeaveRequests.length === 0) && (
                  <p className="text-slate-400 text-center py-4">No pending approvals</p>
                )}
              </div>
            </Card>

            {/* Team Performance */}
            <Card>
              <h3 className="text-xl font-semibold text-cyan-300 mb-6">Team Performance</h3>
              <div className="space-y-4">
                {data?.performanceBreakdown.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-slate-300">{metric.metric}</span>
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div
                        className={`bg-${metric.color}-500 h-2 rounded-full`}
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                    <span className={`text-${metric.color}-400`}>{metric.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </MainLayout>
    </RoleLayout>
  );
}