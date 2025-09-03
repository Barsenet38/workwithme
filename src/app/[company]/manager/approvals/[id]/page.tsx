"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";

interface LeaveRequest {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  leaveType: { name: string };
  user: { firstName: string; lastName: string; avatar?: string };
  reason?: string;
  approvedBy?: { firstName: string; lastName: string };
  approvedAt?: string;
  daysRequested?: number;
}

interface UserData {
  userId: string;
  companyId: string;
  companySubdomain: string;
  firstName?: string;
  lastName?: string;
}

export default function LeaveRequestPage() {
  const { company, id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<LeaveRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

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
    const fetchRequest = async () => {
      if (!userData) return;
      try {
        const res = await axios.get(`http://localhost:5000/manager/approvals/${id}`, {
          params: {
            managerId: userData.userId,
            companyId: userData.companyId,
          },
        });
        if (res.data.success) {
          const requestData = res.data.data;
          // Calculate days requested
          const start = new Date(requestData.startDate);
          const end = new Date(requestData.endDate);
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          setRequest({ ...requestData, daysRequested: days });
        } else {
          setError(res.data.message || "Failed to fetch leave request");
        }
      } catch (err) {
        console.error(err);
        setError("Server error while fetching leave request");
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id, userData]);

  const handleApproval = async (approve: boolean, comments?: string) => {
    if (!request || !userData) return;
    setActionLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/manager/approvals/${request.id}`, {
        approve,
        comments: comments || (approve ? "Approved by manager" : "Rejected by manager"),
        managerId: userData.userId,
        companyId: userData.companyId,
      });
      if (res.data.success) {
        setRequest({ ...request, status: approve ? "APPROVED" : "REJECTED", approvedAt: new Date().toISOString() });
        setShowRejectDialog(false);
        setRejectComment("");
      } else {
        alert(res.data.message || "Action failed");
      }
    } catch {
      alert("Server error while updating request");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-900/30 text-green-300 border border-green-700/50";
      case "REJECTED":
        return "bg-red-900/30 text-red-300 border border-red-700/50";
      case "PENDING":
        return "bg-yellow-900/30 text-yellow-300 border border-yellow-700/50";
      default:
        return "bg-gray-900/30 text-gray-300 border border-gray-700/50";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
      <MainLayout title="Leave Request Details" description="Review and manage employee leave requests" showHeader>
        <div className="min-h-screen bg-gray-900 p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          ) : error ? (
            <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-700/50">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Error</span>
                </div>
                {error}
              </div>
              <button
                onClick={() => router.back()}
                className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Go Back
              </button>
            </div>
          ) : !request ? (
            <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Request Not Found</h3>
              <p className="text-gray-400 mb-4">The requested leave application could not be found.</p>
              <button
                onClick={() => router.back()}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Back to Approvals
              </button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-700">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 border-b border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-2">Leave Request</h1>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                          {request.user.avatar ? (
                            <img
                              src={request.user.avatar}
                              alt={`${request.user.firstName} ${request.user.lastName}`}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-300">
                              {request.user.firstName[0]}
                              {request.user.lastName[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-100">
                            {request.user.firstName} {request.user.lastName}
                          </p>
                          <p className="text-sm text-gray-400">{request.leaveType.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0) + request.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Start Date</h3>
                      <p className="text-lg font-semibold text-white">{formatDate(request.startDate)}</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <h3 className="text-sm font-medium text-gray-400 mb-1">End Date</h3>
                      <p className="text-lg font-semibold text-white">{formatDate(request.endDate)}</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Duration</h3>
                      <p className="text-lg font-semibold text-white">{request.daysRequested} day{request.daysRequested !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Requested On</h3>
                      <p className="text-lg font-semibold text-white">{formatDate(request.startDate)}</p>
                    </div>
                  </div>

                  {request.reason && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Reason for Leave</h3>
                      <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                        <p className="text-gray-200">{request.reason}</p>
                      </div>
                    </div>
                  )}

                  {request.approvedBy && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Approval Details</h3>
                      <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                        <p className="text-gray-200">
                          <span className="font-medium text-white">
                            {request.approvedBy.firstName} {request.approvedBy.lastName}
                          </span>{" "}
                          on {request.approvedAt && new Date(request.approvedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {request.status === "PENDING" && (
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-700">
                      <button
                        onClick={() => handleApproval(true)}
                        disabled={actionLoading}
                        className="flex-1 bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        {actionLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Approve Request
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setShowRejectDialog(true)}
                        disabled={actionLoading}
                        className="flex-1 bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        Reject Request
                      </button>
                    </div>
                  )}

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => router.back()}
                      className="flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                      </svg>
                      Back to Approvals
                    </button>
                    
                    {request.status !== "PENDING" && (
                      <button
                        onClick={() => router.back()}
                        className="bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        View All Requests
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reject Dialog */}
          {showRejectDialog && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">Reject Leave Request</h3>
                <p className="text-gray-400 mb-4">Please provide a reason for rejecting this leave request.</p>
                
                <textarea
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  className="w-full h-32 p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-500"
                />
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowRejectDialog(false);
                      setRejectComment("");
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-gray-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleApproval(false, rejectComment)}
                    disabled={actionLoading || !rejectComment.trim()}
                    className="bg-red-700 hover:bg-red-600 disabled:bg-red-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    {actionLoading ? "Processing..." : "Confirm Rejection"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </RoleLayout>
  );
}