"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface LeaveRequest {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  leaveType: { name: string };
  user: { firstName: string; lastName: string; department?: string };
}

interface UserData {
  userId: string;
  companyId: string;
  companySubdomain: string;
}

interface StatsData {
  pending: number;
  approved: number;
  rejected: number;
  byDepartment: { name: string; count: number }[];
  byLeaveType: { name: string; count: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [activeTab, setActiveTab] = useState("list"); // "list" or "analytics"
  const [statsError, setStatsError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("PENDING"); // Default filter

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<UserData>(token);
        setUserData(decoded);
      } catch {
        setError("Invalid token");
        setLoading(false);
      }
    } else {
      setError("Not authenticated");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userData) return;
      try {
        setLoading(true);
        // First fetch the requests
        const requestsRes = await axios.get("http://localhost:5000/manager/approvals", {
          params: {
            managerId: userData.userId,
            companyId: userData.companyId,
          },
        });
        
        if (requestsRes.data.success) {
          setRequests(requestsRes.data.data);
          // Apply default filter (pending)
          const pendingRequests = requestsRes.data.data.filter((req: LeaveRequest) => req.status === "PENDING");
          setFilteredRequests(pendingRequests);
          
          // Calculate basic stats from the requests data as fallback
          const pending = requestsRes.data.data.filter((req: LeaveRequest) => req.status === "PENDING").length;
          const approved = requestsRes.data.data.filter((req: LeaveRequest) => req.status === "APPROVED").length;
          const rejected = requestsRes.data.data.filter((req: LeaveRequest) => req.status === "REJECTED").length;
          
          const fallbackStats = {
            pending,
            approved,
            rejected,
            byDepartment: [],
            byLeaveType: []
          };
          
          setStats(fallbackStats);
          
          // Then try to fetch the detailed stats
          try {
            const statsRes = await axios.get("http://localhost:5000/manager/approvals/stats", {
              params: {
                managerId: userData.userId,
                companyId: userData.companyId,
              },
            });
            
            if (statsRes.data.success) {
              setStats(statsRes.data.data);
            }
          } catch (statsErr) {
            console.error("Stats endpoint not available, using fallback data", statsErr);
            setStatsError("Advanced analytics not available");
            // We'll use the fallback stats we already set
          }
        } else {
          setError(requestsRes.data.message || "Failed to fetch leave requests");
        }
      } catch (err) {
        console.error(err);
        setError("Server error while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userData]);

  // Handle filter changes
  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    if (status === "ALL") {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(req => req.status === status);
      setFilteredRequests(filtered);
    }
  };

  // Calculate duration for each request
  const requestsWithDuration = filteredRequests.map(req => {
    const start = new Date(req.startDate);
    const end = new Date(req.endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    return { ...req, duration };
  });

  // Calculate stats from requests if stats endpoint is not available
  const effectiveStats = stats || {
    pending: requests.filter(req => req.status === "PENDING").length,
    approved: requests.filter(req => req.status === "APPROVED").length,
    rejected: requests.filter(req => req.status === "REJECTED").length,
    byDepartment: [],
    byLeaveType: []
  };

  return (
    <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
      <MainLayout title="Manager Approvals" description="Approve or reject pending requests" showHeader>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Leave Approvals Dashboard</h1>
            <div className="flex space-x-2 bg-slate-800 p-1 rounded-lg">
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === "list" ? "bg-slate-700 text-white" : "text-slate-300 hover:text-white"}`}
                onClick={() => setActiveTab("list")}
              >
                Request List
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === "analytics" ? "bg-slate-700 text-white" : "text-slate-300 hover:text-white"}`}
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-300">
              <p>{error}</p>
            </div>
          ) : activeTab === "list" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-slate-400 text-sm font-medium">Pending</h3>
                    <div className="w-8 h-8 rounded-full bg-yellow-600/20 flex items-center justify-center">
                      <span className="text-yellow-400 text-sm font-bold">{effectiveStats.pending}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">{effectiveStats.pending}</p>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-slate-400 text-sm font-medium">Approved</h3>
                    <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                      <span className="text-green-400 text-sm font-bold">{effectiveStats.approved}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">{effectiveStats.approved}</p>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-slate-400 text-sm font-medium">Rejected</h3>
                    <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center">
                      <span className="text-red-400 text-sm font-bold">{effectiveStats.rejected}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">{effectiveStats.rejected}</p>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="mb-6 flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange("ALL")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    statusFilter === "ALL" 
                    ? "bg-cyan-600 text-white" 
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  All Requests
                </button>
                <button
                  onClick={() => handleFilterChange("PENDING")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    statusFilter === "PENDING" 
                    ? "bg-yellow-600 text-white" 
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleFilterChange("APPROVED")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    statusFilter === "APPROVED" 
                    ? "bg-green-600 text-white" 
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => handleFilterChange("REJECTED")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    statusFilter === "REJECTED" 
                    ? "bg-red-600 text-white" 
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  Rejected
                </button>
              </div>

              {!filteredRequests.length ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">
                    {statusFilter === "ALL" ? "No requests" : `No ${statusFilter.toLowerCase()} requests`}
                  </h3>
                  <p className="text-slate-400">
                    {statusFilter === "ALL" 
                      ? "No leave requests found for your team" 
                      : `No ${statusFilter.toLowerCase()} leave requests found for your team`
                    }
                  </p>
                </div>
              ) : (
                <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead className="bg-slate-800/80">
                        <tr>
                          <th className="px-4 py-3 text-left text-slate-300">Employee</th>
                          <th className="px-4 py-3 text-left text-slate-300">Leave Type</th>
                          <th className="px-4 py-3 text-left text-slate-300">Dates</th>
                          <th className="px-4 py-3 text-left text-slate-300">Duration</th>
                          <th className="px-4 py-3 text-left text-slate-300">Status</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {requestsWithDuration.map((req) => (
                          <tr
                            key={req.id}
                            className="border-t border-slate-700 hover:bg-slate-700/50 transition"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-3">
                                  <span className="text-xs font-medium text-slate-300">
                                    {req.user.firstName[0]}{req.user.lastName[0]}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-slate-200 font-medium">
                                    {req.user.firstName} {req.user.lastName}
                                  </p>
                                  {req.user.department && (
                                    <p className="text-xs text-slate-400">{req.user.department}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-400">{req.leaveType.name}</td>
                            <td className="px-4 py-3 text-slate-400">
                              {new Date(req.startDate).toLocaleDateString()} -{" "}
                              {new Date(req.endDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-slate-400">
                              {req.duration} day{req.duration !== 1 ? 's' : ''}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 rounded text-xs font-semibold ${
                                  req.status === "PENDING"
                                    ? "bg-yellow-600 text-white"
                                    : req.status === "APPROVED"
                                    ? "bg-green-700 text-white"
                                    : "bg-red-700 text-white"
                                }`}
                              >
                                {req.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Link
                                href={`/${userData?.companySubdomain}/manager/approvals/${req.id}`}
                                className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium"
                              >
                                Review
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Leave Request Analytics (Your Team)</h2>
              
              {statsError && (
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 text-yellow-300 mb-6">
                  <p>{statsError}</p>
                  <p className="text-sm mt-1">Showing basic analytics from available data</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-4">Requests by Status</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Pending', value: effectiveStats.pending },
                            { name: 'Approved', value: effectiveStats.approved },
                            { name: 'Rejected', value: effectiveStats.rejected }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#eab308" />
                          <Cell fill="#22c55e" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-4">Requests by Department</h3>
                  <div className="h-64">
                    {effectiveStats.byDepartment && effectiveStats.byDepartment.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={effectiveStats.byDepartment}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                          <XAxis dataKey="name" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} 
                            itemStyle={{ color: '#f1f5f9' }}
                          />
                          <Legend />
                          <Bar dataKey="count" fill="#0ea5e9" name="Number of Requests" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400">
                        Department data not available
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-4">Requests by Leave Type</h3>
                <div className="h-64">
                  {effectiveStats.byLeaveType && effectiveStats.byLeaveType.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={effectiveStats.byLeaveType}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} 
                          itemStyle={{ color: '#f1f5f9' }}
                        />
                        <Legend />
                        <Bar dataKey="count" fill="#8b5cf6" name="Number of Requests" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      Leave type data not available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </RoleLayout>
  );
}