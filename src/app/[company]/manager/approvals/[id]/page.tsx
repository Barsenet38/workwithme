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
  user: { firstName: string; lastName: string };
  reason?: string;
  approvedBy?: { firstName: string; lastName: string };
  approvedAt?: string;
}

interface UserData {
  userId: string;
  companyId: string;
  companySubdomain: string;
}

export default function LeaveRequestPage() {
  const { company, id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<LeaveRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

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
        if (res.data.success) setRequest(res.data.data);
        else setError(res.data.message || "Failed to fetch leave request");
      } catch (err) {
        console.error(err);
        setError("Server error while fetching leave request");
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id, userData]);

  const handleApproval = async (approve: boolean) => {
    if (!request || !userData) return;
    setActionLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/manager/approvals/${request.id}`, {
        approve,
        comments: approve ? "Approved by manager" : "Rejected by manager",
        managerId: userData.userId,
        companyId: userData.companyId,
      });
      if (res.data.success) {
        setRequest({ ...request, status: approve ? "APPROVED" : "REJECTED", approvedAt: new Date().toISOString() });
      } else alert(res.data.message || "Action failed");
    } catch {
      alert("Server error while updating request");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
      <MainLayout title="Leave Request Details" description="Approve or reject this leave request" showHeader>
        <div className="p-6">
          {loading ? (
            <p>Loading request...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : !request ? (
            <p>Request not found.</p>
          ) : (
            <div className="bg-slate-800/70 p-6 rounded-lg max-w-3xl mx-auto space-y-4">
              <h1 className="text-2xl font-bold text-cyan-300">
                {request.user.firstName} {request.user.lastName}'s Leave Request
              </h1>

              <p>Leave Type: {request.leaveType.name}</p>
              <p>Status: {request.status}</p>
              <p>
                Dates: {new Date(request.startDate).toLocaleDateString()} -{" "}
                {new Date(request.endDate).toLocaleDateString()}
              </p>
              {request.reason && <p>Reason: {request.reason}</p>}
              {request.approvedBy && (
                <p>
                  Approved By: {request.approvedBy.firstName} {request.approvedBy.lastName} at{" "}
                  {request.approvedAt && new Date(request.approvedAt).toLocaleString()}
                </p>
              )}

              {request.status === "PENDING" && (
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleApproval(true)}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(false)}
                    disabled={actionLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}

              <button
                onClick={() => router.back()}
                className="mt-6 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded"
              >
                Back to Approvals
              </button>
            </div>
          )}
        </div>
      </MainLayout>
    </RoleLayout>
  );
}
