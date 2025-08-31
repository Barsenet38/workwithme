"use client";

import { useRouter } from "next/navigation";
import { Shield, Home, ArrowLeft } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/Card";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <MainLayout 
      title="Access Denied" 
      description="You don't have permission to access this page"
      showHeader={true}
    >
      <div className="p-8">
        <Card className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-red-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-slate-300 mb-8">
            You don't have permission to access this page. Please contact your administrator 
            if you believe this is an error.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 px-6 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-6 rounded-lg transition-colors"
            >
              <Home className="h-4 w-4" />
              Go Home
            </button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}