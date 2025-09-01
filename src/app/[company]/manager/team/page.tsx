"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
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

export default function TeamPage() {
  const [team, setTeam] = useState<Employee[]>([]);
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
    const fetchTeam = async () => {
      if (!userData) return;

      try {
        const res = await axios.get("http://localhost:5000/manager/team", {
          params: {
            managerId: userData.userId,
            companyId: userData.companyId,
          },
        });

        if (res.data.success) {
          setTeam(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch team");
        }
      } catch (err: any) {
        console.error(err);
        setError("Server error while fetching team");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [userData]);

  return (
    <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
      <MainLayout title="Manager Dashboard" description="Team overview" showHeader>
        {loading ? (
          <p>Loading team...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : !team.length ? (
          <p>No team members found.</p>
        ) : (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 flex items-center">
              <Users className="mr-2" /> My Team
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.map((member) => (
                <Link
                  key={member.id}
                  href={`/${userData?.companySubdomain}/manager/team/${member.id}`}
                  className="p-4 bg-slate-800/70 rounded-lg hover:bg-slate-700/80 transition-all"
                >
                  <p className="font-semibold text-cyan-300">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-sm text-slate-400">{member.position}</p>
                  <p className="text-xs text-slate-500">{member.email}</p>
                  <p className="text-xs text-slate-500">{member.department?.name}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </MainLayout>
    </RoleLayout>
  );
}
