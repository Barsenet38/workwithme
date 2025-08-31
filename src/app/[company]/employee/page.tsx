import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/Card";
import { User, Calendar, FileText, Clock, Award, Bell } from "lucide-react";

export default function EmployeeDashboard() {
  return (
    <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER", "EMPLOYEE"]}>
      <MainLayout 
        title="Employee Dashboard" 
        description="Your personal workspace"
        showHeader={true}
      >
        <div className="p-8">
          {/* Welcome Header */}
          <Card className="mb-8 bg-gradient-to-r from-slate-800 to-slate-900 border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-cyan-300 mb-2">Welcome Back!</h2>
                <p className="text-slate-400">Here's your personalized dashboard with quick access to everything you need.</p>
              </div>
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-cyan-400" />
              </div>
            </div>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="text-center hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-cyan-300 mb-1">Leave Balance</h3>
              <p className="text-2xl font-bold text-white">18</p>
              <p className="text-slate-400 text-sm">Days Remaining</p>
            </Card>
            
            <Card className="text-center hover:border-green-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                <Clock className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-green-300 mb-1">This Week</h3>
              <p className="text-2xl font-bold text-white">38.5</p>
              <p className="text-slate-400 text-sm">Hours Worked</p>
            </Card>
            
            <Card className="text-center hover:border-blue-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-blue-300 mb-1">Documents</h3>
              <p className="text-2xl font-bold text-white">7</p>
              <p className="text-slate-400 text-sm">Available</p>
            </Card>
            
            <Card className="text-center hover:border-purple-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-3">
                <Award className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-purple-300 mb-1">Performance</h3>
              <p className="text-2xl font-bold text-white">4.8</p>
              <p className="text-slate-400 text-sm">Out of 5.0</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <h3 className="text-xl font-semibold text-cyan-300 mb-6 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-slate-700/50 hover:bg-cyan-600/20 border border-slate-600/50 hover:border-cyan-500/30 p-4 rounded-lg transition-all duration-300 group">
                <User className="h-8 w-8 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white group-hover:text-cyan-300">My Profile</h4>
                <p className="text-slate-400 text-sm">Update personal info</p>
              </button>
              
              <button className="bg-slate-700/50 hover:bg-green-600/20 border border-slate-600/50 hover:border-green-500/30 p-4 rounded-lg transition-all duration-300 group">
                <Calendar className="h-8 w-8 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white group-hover:text-green-300">Request Leave</h4>
                <p className="text-slate-400 text-sm">Submit time off</p>
              </button>
              
              <button className="bg-slate-700/50 hover:bg-blue-600/20 border border-slate-600/50 hover:border-blue-500/30 p-4 rounded-lg transition-all duration-300 group">
                <FileText className="h-8 w-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white group-hover:text-blue-300">Documents</h4>
                <p className="text-slate-400 text-sm">View payslips</p>
              </button>
              
              <button className="bg-slate-700/50 hover:bg-purple-600/20 border border-slate-600/50 hover:border-purple-500/30 p-4 rounded-lg transition-all duration-300 group">
                <Award className="h-8 w-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white group-hover:text-purple-300">Performance</h4>
                <p className="text-slate-400 text-sm">View reviews</p>
              </button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-xl font-semibold text-cyan-300 mb-6">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-green-500/30 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                    <Calendar className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Leave request submitted</p>
                    <p className="text-slate-400 text-sm">August 15-16, 2024 (2 days)</p>
                  </div>
                </div>
                <span className="text-green-400 text-sm">Pending</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                    <FileText className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Payslip available</p>
                    <p className="text-slate-400 text-sm">July 2024 salary statement</p>
                  </div>
                </div>
                <span className="text-blue-400 text-sm">New</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Profile updated</p>
                    <p className="text-slate-400 text-sm">Emergency contact information</p>
                  </div>
                </div>
                <span className="text-cyan-400 text-sm">2 days ago</span>
              </div>
            </div>
          </Card>
        </div>
      </MainLayout>
    </RoleLayout>
  );
}