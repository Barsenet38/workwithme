"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface UserData {
  role: string;
  companyId: string;
  userId: string;
  name: string;
}

export const useRoleGuard = (allowedRoles: string[]) => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/auth");
        return;
      }

      try {
        const decoded: any = jwtDecode(token);
        setUser(decoded);

        // Check if user has required role
        if (allowedRoles.includes(decoded.role)) {
          setIsAuthorized(true);
        } else {
          router.push("/unauthorized");
        }
      } catch (err) {
        console.error("Token validation error:", err);
        localStorage.removeItem("token");
        router.push("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [allowedRoles, router]);

  return { user, isLoading, isAuthorized };
};