import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/Card";
import { Users, CreditCard, Settings, BarChart3, Shield, GitMerge } from "lucide-react";
import { useEffect, useState } from "react";

// Types for our data
interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  billingStatus: string;
  integrationsCount: number;
  securityIssues: number;
  companySettings: any;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // Or your preferred token storage
        
        // Fetch all data in parallel
        const [usersRes, billingRes, settingsRes, analyticsRes, integrationsRes, securityRes] = await Promise.all([
          fetch('/api/admin/users?limit=5&page=1', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('/api/admin/billing/current-company', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('/api/admin/company/current-company/settings', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('/api/admin/analytics?timeframe=month', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('/api/admin/integrations/current-company', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('/api/admin/security/current-company', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        // Check if any request failed
        if (!usersRes.ok || !billingRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        // Parse responses
        const usersData = await usersRes.json();
        const billingData = await billingRes.json();
        const settingsData = await settingsRes.json();
        const analyticsData = await analyticsRes.json();
        const integrationsData = await integrationsRes.json();
        const securityData = await securityRes.json();

        // Transform data for our dashboard
        setStats({
          totalUsers: analyticsData.data.userCount || 0,
          activeUsers: analyticsData.data.activeUsers || 0,
          billingStatus: billingData.data.status || 'Unknown',
          integrationsCount: integrationsData.data.length || 0,
          securityIssues: 0, // You would calculate this based on your security data
          companySettings: settingsData.data || {}
        });
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <RoleLayout allowedRoles={["ADMIN"]}>
        <MainLayout title="Admin Dashboard" description="Company administration and system management">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="text-center hover:border-gray-500/30 transition-all duration-300">
                  <div className="h-12 w-12 bg-gray-700 rounded-full mx-auto mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto animate-pulse"></div>
                </Card>
              ))}
            </div>
          </div>
        </MainLayout>
      </RoleLayout>
    );
  }

  if (error) {
    return (
      <RoleLayout allowedRoles={["ADMIN"]}>
        <MainLayout title="Admin Dashboard" description="Company administration and system management">
          <div className="p-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
              <p className="text-red-400">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white"
              >
                Retry
              </button>
            </div>
          </div>
        </MainLayout>
      </RoleLayout>
    );
  }

  return (
    <RoleLayout allowedRoles={["ADMIN"]}>
      <MainLayout title="Admin Dashboard" description="Company administration and system management">
        <div className="p-8">
          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-cyan-400">{stats.totalUsers}</p>
                <p className="text-sm text-slate-400">Total Users</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-400">{stats.activeUsers}</p>
                <p className="text-sm text-slate-400">Active Users</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-400 capitalize">{stats.billingStatus}</p>
                <p className="text-sm text-slate-400">Billing Status</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-purple-400">{stats.integrationsCount}</p>
                <p className="text-sm text-slate-400">Integrations</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-orange-400">{stats.securityIssues}</p>
                <p className="text-sm text-slate-400">Security Issues</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.companySettings ? Object.keys(stats.companySettings).length : 0}
                </p>
                <p className="text-sm text-slate-400">Settings Configured</p>
              </div>
            </div>
          )}

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="text-center hover:border-cyan-500/30 transition-all duration-300 group cursor-pointer">
              <Users className="h-12 w-12 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-cyan-300">User Management</h3>
              <p className="text-slate-400">Manage system users and roles</p>
              {stats && (
                <div className="mt-3 text-cyan-400 text-sm">
                  {stats.totalUsers} users, {stats.activeUsers} active
                </div>
              )}
            </Card>
            
            <Card className="text-center hover:border-blue-500/30 transition-all duration-300 group cursor-pointer">
              <CreditCard className="h-12 w-12 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-blue-300">Billing & Subscription</h3>
              <p className="text-slate-400">Manage company subscription</p>
              {stats && (
                <div className="mt-3 text-blue-400 text-sm capitalize">
                  Status: {stats.billingStatus}
                </div>
              )}
            </Card>
            
            <Card className="text-center hover:border-green-500/30 transition-all duration-300 group cursor-pointer">
              <Settings className="h-12 w-12 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-green-300">Company Settings</h3>
              <p className="text-slate-400">Configure system policies</p>
              {stats && stats.companySettings && (
                <div className="mt-3 text-green-400 text-sm">
                  {Object.keys(stats.companySettings).length} settings configured
                </div>
              )}
            </Card>
            
            <Card className="text-center hover:border-purple-500/30 transition-all duration-300 group cursor-pointer">
              <BarChart3 className="h-12 w-12 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-purple-300">Analytics</h3>
              <p className="text-slate-400">System performance reports</p>
              {stats && (
                <div className="mt-3 text-purple-400 text-sm">
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active rate
                </div>
              )}
            </Card>
            
            <Card className="text-center hover:border-orange-500/30 transition-all duration-300 group cursor-pointer">
              <GitMerge className="h-12 w-12 text-orange-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-orange-300">Integrations</h3>
              <p className="text-slate-400">Manage third-party apps</p>
              {stats && (
                <div className="mt-3 text-orange-400 text-sm">
                  {stats.integrationsCount} integrations configured
                </div>
              )}
            </Card>
            
            <Card className="text-center hover:border-red-500/30 transition-all duration-300 group cursor-pointer">
              <Shield className="h-12 w-12 text-red-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-red-300">Security</h3>
              <p className="text-slate-400">Access control & policies</p>
              {stats && (
                <div className="mt-3 text-red-400 text-sm">
                  {stats.securityIssues === 0 ? 'No issues' : `${stats.securityIssues} issues detected`}
                </div>
              )}
            </Card>
          </div>
        </div>
      </MainLayout>
    </RoleLayout>
  );
}