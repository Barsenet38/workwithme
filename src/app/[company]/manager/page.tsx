import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/Card";
import { Users, Calendar, CheckCircle, BarChart3, Target, Clock } from "lucide-react";

export default function ManagerDashboard() {
  return (
    <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
      <MainLayout 
        title="Manager Dashboard" 
        description="Team leadership and performance overview"
        showHeader={true}
      >
        <div className="p-8">
          {/* Team Overview Header */}
          <Card className="mb-8 bg-gradient-to-r from-slate-800 to-slate-900 border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-cyan-300 mb-2">Team Overview</h2>
                <p className="text-slate-400">Managing 12 team members across 3 projects</p>
              </div>
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-cyan-400" />
              </div>
            </div>
          </Card>

          {/* Team Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="text-center hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-cyan-300 mb-1">Team Size</h3>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-slate-400 text-sm">Members</p>
            </Card>
            
            <Card className="text-center hover:border-green-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-green-300 mb-1">Present Today</h3>
              <p className="text-2xl font-bold text-white">10</p>
              <p className="text-slate-400 text-sm">Team Members</p>
            </Card>
            
            <Card className="text-center hover:border-blue-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-blue-300 mb-1">Pending Approval</h3>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-slate-400 text-sm">Leave Requests</p>
            </Card>
            
            <Card className="text-center hover:border-purple-500/30 transition-all duration-300 hover:scale-105">
              <div className="mx-auto w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-3">
                <Target className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-purple-300 mb-1">Team Performance</h3>
              <p className="text-2xl font-bold text-white">89%</p>
              <p className="text-slate-400 text-sm">This Month</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <h3 className="text-xl font-semibold text-cyan-300 mb-6 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Management Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-slate-700/50 hover:bg-cyan-600/20 border border-slate-600/50 hover:border-cyan-500/30 p-4 rounded-lg transition-all duration-300 group">
                <Users className="h-8 w-8 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white group-hover:text-cyan-300">Team Roster</h4>
                <p className="text-slate-400 text-sm">View team members</p>
              </button>
              
              <button className="bg-slate-700/50 hover:bg-green-600/20 border border-slate-600/50 hover:border-green-500/30 p-4 rounded-lg transition-all duration-300 group">
                <Calendar className="h-8 w-8 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white group-hover:text-green-300">Approve Leave</h4>
                <p className="text-slate-400 text-sm">Review requests</p>
              </button>
              
              <button className="bg-slate-700/50 hover:bg-blue-600/20 border border-slate-600/50 hover:border-blue-500/30 p-4 rounded-lg transition-all duration-300 group">
                <BarChart3 className="h-8 w-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white group-hover:text-blue-300">Performance</h4>
                <p className="text-slate-400 text-sm">Team metrics</p>
              </button>
              
              <button className="bg-slate-700/50 hover:bg-purple-600/20 border border-slate-600/50 hover:border-purple-500/30 p-4 rounded-lg transition-all duration-300 group">
                <Target className="h-8 w-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white group-hover:text-purple-300">Goals</h4>
                <p className="text-slate-400 text-sm">Set objectives</p>
              </button>
            </div>
          </Card>

          {/* Team Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Approvals */}
            <Card>
              <h3 className="text-xl font-semibold text-cyan-300 mb-6">Pending Approvals</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-green-500/30 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                      <Calendar className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Sarah Johnson</p>
                      <p className="text-slate-400 text-sm">Aug 15-16 • Vacation</p>
                    </div>
                  </div>
                  <span className="text-green-400 text-sm">2 days</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                      <Calendar className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Mike Chen</p>
                      <p className="text-slate-400 text-sm">Aug 20 • Sick leave</p>
                    </div>
                  </div>
                  <span className="text-blue-400 text-sm">1 day</span>
                </div>
              </div>
            </Card>

            {/* Team Performance */}
            <Card>
              <h3 className="text-xl font-semibold text-cyan-300 mb-6">Team Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Project Completion</span>
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <span className="text-cyan-400">85%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">On Time Delivery</span>
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                  </div>
                  <span className="text-green-400">92%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Quality Score</span>
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '89%'}}></div>
                  </div>
                  <span className="text-purple-400">89%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </MainLayout>
    </RoleLayout>
  );
}