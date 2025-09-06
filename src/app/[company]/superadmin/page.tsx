import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Users, Building2, CreditCard, Settings, Shield, Activity, Database, Lock } from "lucide-react";

export default function SuperAdminDashboard() {
  return (
    <RoleLayout allowedRoles={["SUPERADMIN"]}>
      <MainLayout 
        title="Super Admin Dashboard" 
        description="Platform-Wide Administration and Oversight Portal"
        showHeader={true}
      >
        <div className="p-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="text-center hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-3">
                <Building2 className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-cyan-300 mb-1">Active Tenants</h3>
              <p className="text-2xl font-bold text-white">32</p>
              <p className="text-slate-400 text-sm">Companies Onboarded</p>
            </Card>
            
            <Card className="text-center hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                <CreditCard className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-green-300 mb-1">Billing Revenue</h3>
              <p className="text-2xl font-bold text-white">$128K</p>
              <p className="text-slate-400 text-sm">This Month</p>
            </Card>
            
            <Card className="text-center hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-blue-300 mb-1">Total Users</h3>
              <p className="text-2xl font-bold text-white">1,245</p>
              <p className="text-slate-400 text-sm">Across All Tenants</p>
            </Card>
            
            <Card className="text-center hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-3">
                <Database className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-purple-300 mb-1">System Uptime</h3>
              <p className="text-2xl font-bold text-white">99.9%</p>
              <p className="text-slate-400 text-sm">This Month</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <h3 className="text-xl font-semibold text-cyan-300 mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Admin Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-slate-700/50 hover:bg-cyan-600/20 border border-slate-600/50 hover:border-cyan-500/30 p-4 rounded-lg transition-all duration-300 group">
                <Building2 className="h-8 w-8 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white group-hover:text-cyan-300">Manage Tenants</h4>
                <p className="text-slate-400 text-sm">Create or edit company accounts</p>
              </button>
              
              <button className="bg-slate-700/50 hover:bg-green-600/20 border border-slate-600/50 hover:border-green-500/30 p-4 rounded-lg transition-all duration-300 group">
                <CreditCard className="h-8 w-8 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white group-hover:text-green-300">Billing Management</h4>
                <p className="text-slate-400 text-sm">Oversee subscription plans</p>
              </button>
              
              <button className="bg-slate-700/50 hover:bg-blue-600/20 border border-slate-600/50 hover:border-blue-500/30 p-4 rounded-lg transition-all duration-300 group">
                <Shield className="h-8 w-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white group-hover:text-blue-300">Platform Settings</h4>
                <p className="text-slate-400 text-sm">Configure global policies</p>
              </button>
            </div>
          </Card>

          {/* System Overview */}
          <Card className="mb-8">
            <h3 className="text-xl font-semibold text-cyan-300 mb-6 flex items-center">
              <Database className="h-5 w-5 mr-2" />
              System Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 hover:border-cyan-500/30 transition-colors">
                <h4 className="font-semibold text-white mb-2">Database Status</h4>
                <p className="text-slate-400 text-sm">Storage: 1.2TB / 2TB</p>
                <p className="text-slate-400 text-sm">Active Connections: 245</p>
                <p className="text-green-400 text-sm">Status: Optimal</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 hover:border-cyan-500/30 transition-colors">
                <h4 className="font-semibold text-white mb-2">API Performance</h4>
                <p className="text-slate-400 text-sm">Average Response: 85ms</p>
                <p className="text-slate-400 text-sm">Requests per Minute: 5,000</p>
                <p className="text-green-400 text-sm">Status: Stable</p>
              </div>
            </div>
          </Card>

          {/* Recent Audit Logs */}
          <Card>
            <h3 className="text-xl font-semibold text-cyan-300 mb-6 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Audit Logs
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center mr-3">
                    <Building2 className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">New tenant created</p>
                    <p className="text-slate-400 text-sm">Acme Corp - Premium License</p>
                  </div>
                </div>
                <span className="text-cyan-400 text-sm">1 hour ago</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-green-500/30 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                    <Users className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Admin assigned</p>
                    <p className="text-slate-400 text-sm">John Doe - BetaCorp Admin</p>
                  </div>
                </div>
                <span className="text-green-400 text-sm">3 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                    <Lock className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Security settings updated</p>
                    <p className="text-slate-400 text-sm">Enabled 2FA for all tenants</p>
                  </div>
                </div>
                <span className="text-blue-400 text-sm">1 day ago</span>
              </div>
            </div>
          </Card>
        </div>
      </MainLayout>
    </RoleLayout>
  );
}