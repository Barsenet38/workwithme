import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/Card";
import { Users, CreditCard, Settings, BarChart3, Shield, GitMerge } from "lucide-react";

export default function AdminDashboard() {
  return (
    <RoleLayout allowedRoles={["ADMIN"]}>
      <MainLayout title="Admin Dashboard" description="Company administration and system management">
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="text-center hover:border-cyan-500/30 transition-all duration-300">
              <Users className="h-12 w-12 text-cyan-400 mx-auto mb-3" />
              <h3 className="font-semibold text-cyan-300">User Management</h3>
              <p className="text-slate-400">Manage system users and roles</p>
            </Card>
            
            <Card className="text-center hover:border-blue-500/30 transition-all duration-300">
              <CreditCard className="h-12 w-12 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-300">Billing & Subscription</h3>
              <p className="text-slate-400">Manage company subscription</p>
            </Card>
            
            <Card className="text-center hover:border-green-500/30 transition-all duration-300">
              <Settings className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-green-300">Company Settings</h3>
              <p className="text-slate-400">Configure system policies</p>
            </Card>
            
            <Card className="text-center hover:border-purple-500/30 transition-all duration-300">
              <BarChart3 className="h-12 w-12 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-300">Analytics</h3>
              <p className="text-slate-400">System performance reports</p>
            </Card>
            
            <Card className="text-center hover:border-orange-500/30 transition-all duration-300">
              <GitMerge className="h-12 w-12 text-orange-400 mx-auto mb-3" />
              <h3 className="font-semibold text-orange-300">Integrations</h3>
              <p className="text-slate-400">Manage third-party apps</p>
            </Card>
            
            <Card className="text-center hover:border-red-500/30 transition-all duration-300">
              <Shield className="h-12 w-12 text-red-400 mx-auto mb-3" />
              <h3 className="font-semibold text-red-300">Security</h3>
              <p className="text-slate-400">Access control & policies</p>
            </Card>
          </div>
        </div>
      </MainLayout>
    </RoleLayout>
  );
}