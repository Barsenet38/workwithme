import { UserProfile } from '@/types/user';
import { User, Mail, Phone, MapPin, Calendar, Building, IdCard } from 'lucide-react';

interface ProfileViewProps {
  userProfile: UserProfile;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userProfile }) => {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatEmploymentType = (type?: string): string => {
    if (!type) return 'Not specified';
    return type.toLowerCase().replace('_', ' ');
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
        <h3 className="text-xl font-semibold text-cyan-300 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon={User} label="Full Name" value={`${userProfile.firstName} ${userProfile.lastName}`} />
          <InfoItem icon={Mail} label="Work Email" value={userProfile.email} />
          <InfoItem icon={Mail} label="Personal Email" value={userProfile.personalEmail} />
          <InfoItem icon={Phone} label="Phone" value={userProfile.phone} />
          <InfoItem icon={Calendar} label="Date of Birth" value={formatDate(userProfile.dateOfBirth)} />
          <InfoItem icon={IdCard} label="Employee ID" value={userProfile.employeeId} />
        </div>
      </div>

      {/* Address Information */}
      {userProfile.address && (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
          <h3 className="text-xl font-semibold text-cyan-300 mb-4">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem icon={MapPin} label="Street" value={userProfile.address.street} />
            <InfoItem icon={MapPin} label="City" value={userProfile.address.city} />
            <InfoItem icon={MapPin} label="State" value={userProfile.address.state} />
            <InfoItem icon={MapPin} label="ZIP Code" value={userProfile.address.zipCode} />
            <InfoItem icon={MapPin} label="Country" value={userProfile.address.country} />
          </div>
        </div>
      )}

      {/* Employment Information */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
        <h3 className="text-xl font-semibold text-cyan-300 mb-4">Employment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon={Building} label="Department" value={userProfile.department} />
          <InfoItem icon={User} label="Position" value={userProfile.position} />
          <InfoItem icon={Calendar} label="Employment Type" value={formatEmploymentType(userProfile.employmentType)} />
          <InfoItem icon={Calendar} label="Date Hired" value={formatDate(userProfile.dateHired)} />
          <InfoItem icon={IdCard} label="Role" value={userProfile.role} />
        </div>
      </div>
    </div>
  );
};

// Helper component for consistent info items
const InfoItem: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
}> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start">
    <Icon className="h-5 w-5 text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white">{value || 'Not provided'}</p>
    </div>
  </div>
);