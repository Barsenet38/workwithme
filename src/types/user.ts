export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  personalEmail?: string;
  dateOfBirth?: string;
  address?: Address;
  position: string;
  department?: string;
  employmentType?: string;
  dateHired?: string;
  employeeId?: string;
  role: string;
}

export interface JwtPayload {
  userId: string;
  role: string;
  companyId: string;
  name: string;
  companySubdomain?: string;
  exp: number;
  iat: number;
}