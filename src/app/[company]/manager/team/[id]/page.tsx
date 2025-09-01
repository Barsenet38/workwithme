"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department?: { name: string };
  status: string;
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

  return (
    <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
      <MainLayout title="Manager Dashboard" description="Team overview" showHeader>
        {loading ? (
          <p>Loading team member...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : !member ? (
          <p>Team member not found.</p>
        ) : (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Team Member Details</h1>
            <div className="bg-slate-800/70 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-cyan-300 mb-4">
                {member.firstName} {member.lastName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Position</p>
                  <p className="text-slate-200">{member.position}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-slate-200">{member.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Department</p>
                  <p className="text-slate-200">{member.department?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Status</p>
                  <p className="text-slate-200">{member.status}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </MainLayout>
    </RoleLayout>
  );
}
