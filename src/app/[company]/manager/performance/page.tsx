// C:\Users\yonas\Documents\HR\src\app\[company]\manager\performance\page.tsx
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
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

interface PerformanceReview {
  id: string;
  reviewDate: string;
  goals?: string;
  strengths?: string;
  improvements?: string;
  rating?: number;
  feedback?: string;
  isCompleted: boolean;
  completedAt?: string;
  reviewee: {
    id: string;
    firstName: string;
    lastName: string;
    department?: {
      name: string;
    };
    position: string;
  };
  reviewer: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface UserData {
  userId: string;
  companyId: string;
  companySubdomain: string;
}

interface StatsData {
  completed: number;
  pending: number;
  avgRating: number;
  byDepartment: { name: string; count: number }[];
  byRating: { rating: number; count: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const RADAR_COLORS = ['#0088FE', '#00C49F'];

export default function PerformancePage() {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<PerformanceReview[]>([]);
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
        // First fetch the reviews
        const reviewsRes = await axios.get("http://localhost:5000/manager/performance", {
          params: {
            managerId: userData.userId,
            companyId: userData.companyId,
          },
        });
        
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.data);
          // Apply default filter (pending)
          const pendingReviews = reviewsRes.data.data.filter((review: PerformanceReview) => !review.isCompleted);
          setFilteredReviews(pendingReviews);
          
          // Calculate basic stats from the reviews data as fallback
          const completed = reviewsRes.data.data.filter((review: PerformanceReview) => review.isCompleted).length;
          const pending = reviewsRes.data.data.filter((review: PerformanceReview) => !review.isCompleted).length;
          
          const ratings = reviewsRes.data.data
            .filter((review: PerformanceReview) => review.rating !== null && review.rating !== undefined)
            .map((review: PerformanceReview) => review.rating as number);
          
          const avgRating = ratings.length > 0 
            ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
            : 0;
          
          const fallbackStats = {
            completed,
            pending,
            avgRating,
            byDepartment: [],
            byRating: []
          };
          
          setStats(fallbackStats);
          
          // Then try to fetch the detailed stats
          try {
            const statsRes = await axios.get("http://localhost:5000/manager/performance/stats", {
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
          setError(reviewsRes.data.message || "Failed to fetch performance reviews");
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
      setFilteredReviews(reviews);
    } else if (status === "COMPLETED") {
      const filtered = reviews.filter(review => review.isCompleted);
      setFilteredReviews(filtered);
    } else {
      const filtered = reviews.filter(review => !review.isCompleted);
      setFilteredReviews(filtered);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate stats from reviews if stats endpoint is not available
  const effectiveStats = stats || {
    completed: reviews.filter(review => review.isCompleted).length,
    pending: reviews.filter(review => !review.isCompleted).length,
    avgRating: 0,
    byDepartment: [],
    byRating: []
  };

  // Prepare data for rating distribution chart
  const ratingDistributionData = [
    { rating: '1 Star', count: effectiveStats.byRating.find(r => r.rating === 1)?.count || 0 },
    { rating: '2 Stars', count: effectiveStats.byRating.find(r => r.rating === 2)?.count || 0 },
    { rating: '3 Stars', count: effectiveStats.byRating.find(r => r.rating === 3)?.count || 0 },
    { rating: '4 Stars', count: effectiveStats.byRating.find(r => r.rating === 4)?.count || 0 },
    { rating: '5 Stars', count: effectiveStats.byRating.find(r => r.rating === 5)?.count || 0 },
  ];

  return (
    <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
      <MainLayout title="Performance Management" description="Manage team performance reviews" showHeader>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Performance Management</h1>
            <div className="flex space-x-2 bg-slate-800 p-1 rounded-lg">
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === "list" ? "bg-slate-700 text-white" : "text-slate-300 hover:text-white"}`}
                onClick={() => setActiveTab("list")}
              >
                Review List
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
                    <h3 className="text-slate-400 text-sm font-medium">Pending Reviews</h3>
                    <div className="w-8 h-8 rounded-full bg-yellow-600/20 flex items-center justify-center">
                      <span className="text-yellow-400 text-sm font-bold">{effectiveStats.pending}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">{effectiveStats.pending}</p>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-slate-400 text-sm font-medium">Completed</h3>
                    <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                      <span className="text-green-400 text-sm font-bold">{effectiveStats.completed}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">{effectiveStats.completed}</p>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-slate-400 text-sm font-medium">Avg. Rating</h3>
                    <div className="w-8 h-8 rounded-full bg-cyan-600/20 flex items-center justify-center">
                      <span className="text-cyan-400 text-sm font-bold">{effectiveStats.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">{effectiveStats.avgRating.toFixed(1)}/5</p>
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
                  All Reviews
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
                  onClick={() => handleFilterChange("COMPLETED")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    statusFilter === "COMPLETED" 
                    ? "bg-green-600 text-white" 
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  Completed
                </button>
              </div>

              {!filteredReviews.length ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">
                    {statusFilter === "ALL" ? "No reviews" : `No ${statusFilter.toLowerCase()} reviews`}
                  </h3>
                  <p className="text-slate-400">
                    {statusFilter === "ALL" 
                      ? "No performance reviews found for your team" 
                      : `No ${statusFilter.toLowerCase()} performance reviews found for your team`
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
                          <th className="px-4 py-3 text-left text-slate-300">Reviewer</th>
                          <th className="px-4 py-3 text-left text-slate-300">Review Date</th>
                          <th className="px-4 py-3 text-left text-slate-300">Rating</th>
                          <th className="px-4 py-3 text-left text-slate-300">Status</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReviews.map((review) => (
                          <tr
                            key={review.id}
                            className="border-t border-slate-700 hover:bg-slate-700/50 transition"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-3">
                                  <span className="text-xs font-medium text-slate-300">
                                    {review.reviewee.firstName[0]}{review.reviewee.lastName[0]}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-slate-200 font-medium">
                                    {review.reviewee.firstName} {review.reviewee.lastName}
                                  </p>
                                  <p className="text-xs text-slate-400">{review.reviewee.position}</p>
                                  {review.reviewee.department && (
                                    <p className="text-xs text-slate-400">{review.reviewee.department.name}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-400">
                              {review.reviewer.firstName} {review.reviewer.lastName}
                            </td>
                            <td className="px-4 py-3 text-slate-400">
                              {formatDate(review.reviewDate)}
                            </td>
                            <td className="px-4 py-3">
                              {review.rating ? (
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-4 h-4 ${i < review.rating! ? 'text-yellow-400' : 'text-slate-600'}`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                  <span className="ml-1 text-slate-400 text-sm">({review.rating})</span>
                                </div>
                              ) : (
                                <span className="text-slate-500">Not rated</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 rounded text-xs font-semibold ${
                                  review.isCompleted
                                    ? "bg-green-700 text-white"
                                    : "bg-yellow-600 text-white"
                                }`}
                              >
                                {review.isCompleted ? "COMPLETED" : "PENDING"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Link
                                href={`/${userData?.companySubdomain}/manager/performance/${review.id}`}
                                className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium"
                              >
                                {review.isCompleted ? "View" : "Complete"}
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
              <h2 className="text-xl font-bold mb-6 text-white">Performance Analytics (Your Team)</h2>
              
              {statsError && (
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 text-yellow-300 mb-6">
                  <p>{statsError}</p>
                  <p className="text-sm mt-1">Showing basic analytics from available data</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-4">Reviews by Status</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Completed', value: effectiveStats.completed },
                            { name: 'Pending', value: effectiveStats.pending }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#22c55e" />
                          <Cell fill="#eab308" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-4">Rating Distribution</h3>
                  <div className="h-64">
                    {ratingDistributionData.some(r => r.count > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={ratingDistributionData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                          <XAxis dataKey="rating" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} 
                            itemStyle={{ color: '#f1f5f9' }}
                          />
                          <Legend />
                          <Bar dataKey="count" fill="#f59e0b" name="Number of Reviews" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400">
                        No rating data available
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-4">Reviews by Department</h3>
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
                        <Bar dataKey="count" fill="#0ea5e9" name="Number of Reviews" />
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
          )}
        </div>
      </MainLayout>
    </RoleLayout>
  );
}