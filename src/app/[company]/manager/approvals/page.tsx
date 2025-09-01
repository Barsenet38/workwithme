"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
}

interface UserData {
  userId: string;
  companyId: string;
  companySubdomain: string;
}

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

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
    const fetchRequests = async () => {
      if (!userData) return;
      try {
        const res = await axios.get("http://localhost:5000/manager/approvals", {
          params: {
            managerId: userData.userId,
            companyId: userData.companyId,
          },
        });
        if (res.data.success) setRequests(res.data.data);
        else setError(res.data.message || "Failed to fetch leave requests");
      } catch (err) {
        console.error(err);
        setError("Server error while fetching leave requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [userData]);

  return (
    <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
      <MainLayout title="Manager Approvals" description="Approve or reject pending requests" showHeader>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Pending Approvals</h1>
          {loading ? (
            <p>Loading requests...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : !requests.length ? (
            <p>No pending requests.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <Link
                  key={req.id}
                  href={`/${userData?.companySubdomain}/manager/approvals/${req.id}`}
                  className="block bg-slate-800/70 p-4 rounded-lg hover:bg-slate-700 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-slate-200 font-semibold">
                        {req.user.firstName} {req.user.lastName}
                      </p>
                      <p className="text-slate-400">{req.leaveType.name}</p>
                      <p className="text-slate-400">
                        {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`px-3 py-1 rounded font-semibold ${
                          req.status === "PENDING"
                            ? "bg-yellow-600 text-white"
                            : req.status === "APPROVED"
                            ? "bg-green-700 text-white"
                            : "bg-red-700 text-white"
                        }`}
                      >
                        {req.status}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </MainLayout>
    </RoleLayout>
  );
}
