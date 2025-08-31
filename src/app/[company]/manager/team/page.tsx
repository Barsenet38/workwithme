import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/Card";
import { Users, Calendar, Target, BarChart3 } from "lucide-react";

export default function TeamManagement() {
  return (
    <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER"]}>
      <MainLayout title="Team Management" description="Overview and management of your team">
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <Users className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-slate-400">Team Members</p>
            </Card>
            <Card className="text-center">
              <Calendar className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-slate-400">Pending Approvals</p>
            </Card>
            <Card className="text-center">
              <Target className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">89%</p>
              <p className="text-slate-400">Performance</p>
            </Card>
            <Card className="text-center">
              <BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">95%</p>
              <p className="text-slate-400">Attendance</p>
            </Card>
          </div>

          <Card>
            <h3 className="text-xl font-semibold text-cyan-300 mb-6">Team Members</h3>
            {/* Team member list with performance metrics */}
          </Card>
        </div>
      </MainLayout>
    </RoleLayout>
  );
}