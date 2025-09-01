// prisma/seed.js
const { PrismaClient, UserRole, EmploymentType } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 10);

  const company = await prisma.company.create({
    data: {
      name: "Acme Corp",
      subdomain: "acme",
      description: "Test company for HR system",
      contactEmail: "hr@acme.com",
      phone: "+1-555-123-4567",
      address: {
        street: "123 Main St",
        city: "Metropolis",
        state: "CA",
        zipCode: "90001",
        country: "USA",
      },
      subscriptionPlan: "pro",
      billingEmail: "billing@acme.com",
      status: "active",
    },
  });

  const hrDept = await prisma.department.create({
    data: {
      companyId: company.id,
      name: "Human Resources",
      description: "Handles HR operations",
    },
  });

  const itDept = await prisma.department.create({
    data: {
      companyId: company.id,
      name: "IT",
      description: "Tech support and infrastructure",
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      companyId: company.id,
      email: "admin@acme.com",
      passwordHash,
      role: UserRole.ADMIN,
      firstName: "Alice",
      lastName: "Admin",
      position: "HR Administrator",
      employmentType: EmploymentType.FULL_TIME,
      status: "ACTIVE",
      employeeId: "EMP001",
      departmentId: hrDept.id,
      dateHired: new Date("2022-01-15"),
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
