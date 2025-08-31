import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/Card";
import { Calendar, Plus, Clock } from "lucide-react";

export default function LeaveManagement() {
  return (
    <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER", "EMPLOYEE"]}>
      <MainLayout title="Leave Management" description="Request and track your time off">
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <Calendar className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">18</p>
              <p className="text-slate-400">Total Balance</p>
            </Card>
            <Card className="text-center">
              <Clock className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">5</p>
              <p className="text-slate-400">Used This Year</p>
            </Card>
            <Card className="text-center">
              <Plus className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">13</p>
              <p className="text-slate-400">Remaining</p>
            </Card>
          </div>

          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-cyan-300">Leave Requests</h3>
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </button>
            </div>
            {/* Leave request list */}
          </Card>
        </div>
      </MainLayout>
    </RoleLayout>
  );
}