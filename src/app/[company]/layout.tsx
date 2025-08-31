"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface UserData {
  userId: string;
  role: string;
  companyId: string;
  name: string;
}

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { company } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      
      // Verify user belongs to this company
      if (decoded.companySubdomain !== company) {
        router.push("/auth");
        return;
      }

      setUser({
        userId: decoded.userId,
        role: decoded.role,
        companyId: decoded.companyId,
        name: decoded.name,
      });
    } catch (err) {
      console.error("Invalid token", err);
      router.push("/auth");
    } finally {
      setLoading(false);
    }
  }, [company, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <>{children}</>;
}