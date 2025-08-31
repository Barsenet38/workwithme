"use client";

import { useParams } from "next/navigation";
import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";
import { ProfileView } from "@/components/profile/ProfileView";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function ProfilePage() {
  const { company } = useParams();
  const { userProfile, loading, error } = useUserProfile();

  const handleRetry = (): void => {
    window.location.reload();
  };

  return (
    <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER", "EMPLOYEE"]}>
      <MainLayout 
        title="My Profile" 
        description="Your personal information and employment details"
      >
        <div className="p-8">
          {loading && <LoadingSpinner />}
          
          {error && (
            <ErrorDisplay 
              message={error} 
              onRetry={handleRetry}
            />
          )}
          
          {userProfile && !loading && !error && (
            <ProfileView userProfile={userProfile} />
          )}
          
          {!userProfile && !loading && !error && (
            <ErrorDisplay message="No profile data available" />
          )}
        </div>
      </MainLayout>
    </RoleLayout>
  );
}