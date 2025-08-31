import RoleLayout from "@/components/layout/RoleLayout";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/Card";
import { User, Mail, Phone, MapPin, Calendar, Edit } from "lucide-react";

export default function ProfilePage() {
  return (
    <RoleLayout allowedRoles={["ADMIN", "HR", "MANAGER", "EMPLOYEE"]}>
      <MainLayout title="My Profile" description="Manage your personal information">
        <div className="p-8">
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cyan-300">Personal Information</h2>
              <button className="flex items-center text-cyan-400 hover:text-cyan-300">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <User className="h-5 w-5 text-slate-400 mr-3" />
                <div>
                  <p className="text-slate-400 text-sm">Full Name</p>
                  <p className="text-white">John Doe</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-slate-400 mr-3" />
                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="text-white">john.doe@company.com</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-slate-400 mr-3" />
                <div>
                  <p className="text-slate-400 text-sm">Phone</p>
                  <p className="text-white">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-slate-400 mr-3" />
                <div>
                  <p className="text-slate-400 text-sm">Date of Birth</p>
                  <p className="text-white">January 15, 1990</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-cyan-300 mb-6">Address Information</h3>
            {/* Address form fields */}
          </Card>
        </div>
      </MainLayout>
    </RoleLayout>
  );
}