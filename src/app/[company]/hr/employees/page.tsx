import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/Card";
import { Users, UserPlus, Search, Filter } from "lucide-react";

export default function EmployeeManagement() {
  return (
    <RoleLayout allowedRoles={["ADMIN", "HR"]}>
      <MainLayout title="Employee Management" description="Manage employee records and profiles">
        <div className="p-8">
          {/* Header with Actions */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-cyan-300">Employee Directory</h2>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </button>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white"
                />
              </div>
              <select className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>Sales</option>
              </select>
              <select className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white">
                <option>All Status</option>
                <option>Active</option>
                <option>On Leave</option>
                <option>Terminated</option>
              </select>
            </div>
          </Card>

          {/* Employee List */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left text-slate-400 pb-3">Employee</th>
                    <th className="text-left text-slate-400 pb-3">Department</th>
                    <th className="text-left text-slate-400 pb-3">Position</th>
                    <th className="text-left text-slate-400 pb-3">Status</th>
                    <th className="text-left text-slate-400 pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700/30 hover:bg-slate-700/20">
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center mr-3">
                          <Users className="h-4 w-4 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Sarah Johnson</p>
                          <p className="text-slate-400 text-sm">sarah@company.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300">Engineering</td>
                    <td className="py-3 text-slate-300">Senior Developer</td>
                    <td className="py-3">
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                        Active
                      </span>
                    </td>
                    <td className="py-3">
                      <button className="text-cyan-400 hover:text-cyan-300 text-sm">
                        View Profile
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </MainLayout>
    </RoleLayout>
  );
}