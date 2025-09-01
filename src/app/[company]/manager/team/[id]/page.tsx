"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  personalEmail?: string;
  avatar?: string;
  dateOfBirth?: string;
  address?: any;
  employeeId?: string;
  position: string;
  department?: { id: string; name: string };
  employmentType?: string;
  status: string;
  dateHired?: string;
  dateTerminated?: string;
  manager?: { id: string; firstName: string; lastName: string };
  bankAccount?: any;
  taxInfo?: any;
  leaveBalances?: any[];
  leaveRequests?: any[];
  attendances?: any[];
  documents?: any[];
  payrolls?: any[];
  performanceReviewsAsReviewee?: any[];
  performanceReviewsAsReviewer?: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface UserData {
  userId: string;
  companyId: string;
  companySubdomain: string;
}

export default function TeamMemberPage() {
  const params = useParams();
  const memberId = params.id as string;

  const [member, setMember] = useState<Employee | null>(null);
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
    const fetchTeamMember = async () => {
      if (!userData || !memberId) return;

      try {
        const res = await axios.get(`http://localhost:5000/manager/team/${memberId}`, {
          params: {
            managerId: userData.userId,
            companyId: userData.companyId,
          },
        });

        if (res.data.success) {
          setMember(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch team member");
        }
      } catch (err: any) {
        console.error(err);
        setError("Server error while fetching team member");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMember();
  }, [userData, memberId]);

  if (loading) return <p className="p-6">Loading team member...</p>;
  if (error) return <p className="p-6 text-red-400">{error}</p>;
  if (!member) return <p className="p-6">Team member not found.</p>;

  return (
    <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
      <MainLayout title="Manager Dashboard" description="Team overview" showHeader>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold mb-4">Team Member Details</h1>

          {/* Personal Info */}
          <section className="bg-slate-800/70 rounded-lg p-6 space-y-2">
            <h2 className="text-xl font-semibold text-cyan-300 mb-2">Personal Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Name</p>
                <p className="text-slate-200">{member.firstName} {member.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Email</p>
                <p className="text-slate-200">{member.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Personal Email</p>
                <p className="text-slate-200">{member.personalEmail || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Phone</p>
                <p className="text-slate-200">{member.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Date of Birth</p>
                <p className="text-slate-200">{member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Address</p>
                <p className="text-slate-200">{member.address ? JSON.stringify(member.address) : "N/A"}</p>
              </div>
            </div>
          </section>

          {/* Employment Info */}
          <section className="bg-slate-800/70 rounded-lg p-6 space-y-2">
            <h2 className="text-xl font-semibold text-cyan-300 mb-2">Employment Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Employee ID</p>
                <p className="text-slate-200">{member.employeeId || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Position</p>
                <p className="text-slate-200">{member.position}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Department</p>
                <p className="text-slate-200">{member.department?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Employment Type</p>
                <p className="text-slate-200">{member.employmentType || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Status</p>
                <p className="text-slate-200">{member.status}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Manager</p>
                <p className="text-slate-200">{member.manager ? `${member.manager.firstName} ${member.manager.lastName}` : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Date Hired</p>
                <p className="text-slate-200">{member.dateHired ? new Date(member.dateHired).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Date Terminated</p>
                <p className="text-slate-200">{member.dateTerminated ? new Date(member.dateTerminated).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>
          </section>

          {/* Bank & Tax Info */}
          <section className="bg-slate-800/70 rounded-lg p-6 space-y-2">
            <h2 className="text-xl font-semibold text-cyan-300 mb-2">Bank & Tax Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Bank Account</p>
                <p className="text-slate-200">{member.bankAccount ? JSON.stringify(member.bankAccount) : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Tax Info</p>
                <p className="text-slate-200">{member.taxInfo ? JSON.stringify(member.taxInfo) : "N/A"}</p>
              </div>
            </div>
          </section>

          {/* Leave Balances */}
          {member.leaveBalances && member.leaveBalances.length > 0 && (
            <section className="bg-slate-800/70 rounded-lg p-6 space-y-2">
              <h2 className="text-xl font-semibold text-cyan-300 mb-2">Leave Balances</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {member.leaveBalances.map((lb, i) => (
                  <div key={i}>
                    <p className="text-sm text-slate-400">{lb.leaveType?.name}</p>
                    <p className="text-slate-200">Balance: {lb.balance}, Used: {lb.used}, Accrued: {lb.accrued}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Documents */}
          {member.documents && member.documents.length > 0 && (
            <section className="bg-slate-800/70 rounded-lg p-6 space-y-2">
              <h2 className="text-xl font-semibold text-cyan-300 mb-2">Documents</h2>
              <ul className="list-disc pl-5 text-slate-200">
                {member.documents.map((doc) => (
                  <li key={doc.id}>
                    {doc.title} - <a href={doc.fileUrl} className="text-cyan-400 underline" target="_blank">{doc.fileName}</a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Payrolls */}
          {member.payrolls && member.payrolls.length > 0 && (
            <section className="bg-slate-800/70 rounded-lg p-6 space-y-2">
              <h2 className="text-xl font-semibold text-cyan-300 mb-2">Payroll History</h2>
              <ul className="list-disc pl-5 text-slate-200">
                {member.payrolls.map((pay) => (
                  <li key={pay.id}>
                    Period: {new Date(pay.payPeriodStart).toLocaleDateString()} - {new Date(pay.payPeriodEnd).toLocaleDateString()}, Net Pay: {pay.netPay}, Status: {pay.status}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Performance Reviews */}
          {member.performanceReviewsAsReviewee && member.performanceReviewsAsReviewee.length > 0 && (
            <section className="bg-slate-800/70 rounded-lg p-6 space-y-2">
              <h2 className="text-xl font-semibold text-cyan-300 mb-2">Performance Reviews</h2>
              <ul className="list-disc pl-5 text-slate-200">
                {member.performanceReviewsAsReviewee.map((review) => (
                  <li key={review.id}>
                    Reviewer: {review.reviewer.firstName} {review.reviewer.lastName}, Rating: {review.rating || "N/A"}, Completed: {review.isCompleted ? "Yes" : "No"}
                  </li>
                ))}
              </ul>
            </section>
          )}

        </div>
      </MainLayout>
    </RoleLayout>
  );
}
