import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/Card";
import { Users, FileText, Calendar, DollarSign, BarChart3, UserPlus } from "lucide-react";

export default function HRDashboard() {
  return (
    <RoleLayout allowedRoles={["ADMIN", "HR"]}>
      <MainLayout 
        title="HR Dashboard" 
        description="Human Resources Management Portal"
        showHeader={true}
      >
        <div className="p-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="text-center hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-cyan-300 mb-1">Employees</h3>
              <p className="text-2xl font-bold text-white">142</p>
              <p className="text-slate-400 text-sm">Total Staff</p>
            </Card>
            
            <Card className="text-center hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-green-300 mb-1">Leave Requests</h3>
              <p className="text-2xl font-bold text-white">8</p>
              <p className="text-slate-400 text-sm">Pending Approval</p>
            </Card>
            
            <Card className="text-center hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                <DollarSign className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-blue-300 mb-1">Payroll</h3>
              <p className="text-2xl font-bold text-white">$245K</p>
              <p className="text-slate-400 text-sm">This Month</p>
            </Card>
            
            <Card className="text-center hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-3">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-purple-300 mb-1">Performance</h3>
              <p className="text-2xl font-bold text-white">92%</p>
              <p className="text-slate-400 text-sm">Satisfaction</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <h3 className="text-xl font-semibold text-cyan-300 mb-6 flex items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-slate-700/50 hover:bg-cyan-600/20 border border-slate-600/50 hover:border-cyan-500/30 p-4 rounded-lg transition-all duration-300 group">
                <Users className="h-8 w-8 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white group-hover:text-cyan-300">Add Employee</h4>
                <p className="text-slate-400 text-sm">Create new employee record</p>
              </button>
              
              <button className="bg-slate-700/50 hover:bg-green-600/20 border border-slate-600/50 hover:border-green-500/30 p-4 rounded-lg transition-all duration-300 group">
                <FileText className="h-8 w-8 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white group-hover:text-green-300">Process Payroll</h4>
                <p className="text-slate-400 text-sm">Run payroll for this period</p>
              </button>
              
              <button className="bg-slate-700/50 hover:bg-blue-600/20 border border-slate-600/50 hover:border-blue-500/30 p-4 rounded-lg transition-all duration-300 group">
                <Calendar className="h-8 w-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white group-hover:text-blue-300">Manage Leave</h4>
                <p className="text-slate-400 text-sm">Review leave requests</p>
              </button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-xl font-semibold text-cyan-300 mb-6">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center mr-3">
                    <UserPlus className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">New employee onboarded</p>
                    <p className="text-slate-400 text-sm">Sarah Johnson - Software Engineer</p>
                  </div>
                </div>
                <span className="text-cyan-400 text-sm">2 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-green-500/30 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                    <FileText className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Leave request approved</p>
                    <p className="text-slate-400 text-sm">Michael Chen - 3 days</p>
                  </div>
                </div>
                <span className="text-green-400 text-sm">5 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                    <DollarSign className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Payroll processed</p>
                    <p className="text-slate-400 text-sm">August 2024 payroll completed</p>
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