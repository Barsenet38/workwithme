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
  <div className="overflow-x-auto rounded-lg border border-slate-700">
    <table className="w-full border-collapse text-sm">
      <thead className="bg-slate-800/80">
        <tr>
          <th className="px-4 py-3 text-left text-slate-300">Employee</th>
          <th className="px-4 py-3 text-left text-slate-300">Leave Type</th>
          <th className="px-4 py-3 text-left text-slate-300">Dates</th>
          <th className="px-4 py-3 text-left text-slate-300">Status</th>
          <th className="px-4 py-3"></th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req) => (
          <tr
            key={req.id}
            className="border-t border-slate-700 hover:bg-slate-700/50 transition"
          >
            <td className="px-4 py-3 text-slate-200 font-medium">
              {req.user.firstName} {req.user.lastName}
            </td>
            <td className="px-4 py-3 text-slate-400">{req.leaveType.name}</td>
            <td className="px-4 py-3 text-slate-400">
              {new Date(req.startDate).toLocaleDateString()} -{" "}
              {new Date(req.endDate).toLocaleDateString()}
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
                className="text-cyan-400 hover:underline font-medium"
              >
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

        </div>
      </MainLayout>
    </RoleLayout>
  );
}
