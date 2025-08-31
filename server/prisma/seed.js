import { PrismaClient, UserRole, EmploymentType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // Create company
const company = await prisma.company.upsert({
  where: { name: "Asmiin" },
  update: {}, // nothing to update
  create: {
    name: "Asmiin",
    description: "HR & Payroll Management System",
    subdomain: "asmiin",
    contactEmail: "info@asmiin.com",
    phone: "+251900000000",
    address: {
      street: "Bole Road",
      city: "Addis Ababa",
      state: "Addis Ababa",
      zipCode: "1000",
      country: "Ethiopia",
    },
    subscriptionPlan: "PRO",
    billingEmail: "billing@asmiin.com",
    status: "active",
    users: {
      create: [
        {
          email: "admin@asmiin.com",
          passwordHash,
          role: UserRole.ADMIN,
          firstName: "System",
          lastName: "Admin",
          position: "Administrator",
          employmentType: EmploymentType.FULL_TIME,
        },
        {
          email: "hr@asmiin.com",
          passwordHash,
          role: UserRole.HR,
          firstName: "HR",
          lastName: "Manager",
          position: "HR Manager",
          employmentType: EmploymentType.FULL_TIME,
        },
        {
          email: "manager@asmiin.com",
          passwordHash,
          role: UserRole.MANAGER,
          firstName: "Team",
          lastName: "Manager",
          position: "Project Manager",
          employmentType: EmploymentType.FULL_TIME,
        },
        {
          email: "employee@asmiin.com",
          passwordHash,
          role: UserRole.EMPLOYEE,
          firstName: "John",
          lastName: "Doe",
          position: "Software Engineer",
          employmentType: EmploymentType.FULL_TIME,
        },
      ],
    },
  },
  include: { users: true },
});


  console.log("Seeded company:", company.name);
  company.users.forEach(user => {
    console.log(`User created: ${user.role} - ${user.email}`);
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
