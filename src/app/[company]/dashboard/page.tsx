"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import MainLayout from "@/components/layout/MainLayout";

export default function DashboardRedirect() {
  const { company } = useParams();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      
      if (decoded.companyId) {
        switch (decoded.role) {
          case "ADMIN":
            router.push(`/${company}/admin`);
            break;
          case "HR":
            router.push(`/${company}/hr`);
            break;
          case "MANAGER":
            router.push(`/${company}/manager`);
            break;
          case "EMPLOYEE":
            router.push(`/${company}/employee`);
            break;
            case "SUPERADMIN":
            router.push(`/${company}/superadmin`);
            break;
          default:
            router.push("/auth");
        }
      } else {
        throw new Error("Invalid token structure");
      }
    } catch (err) {
      console.error("Token error:", err);
      localStorage.removeItem("token");
      router.push("/auth");
    } finally {
      setIsRedirecting(false);
    }
  }, [company, router]);

  return (
    <MainLayout 
      title="Redirecting..." 
      description="Taking you to your dashboard"
      showHeader={true}
    >
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-cyan-400 mb-2">Redirecting</h2>
        <p className="text-slate-400">Taking you to your personalized dashboard...</p>
      </div>
    </MainLayout>
  );
}