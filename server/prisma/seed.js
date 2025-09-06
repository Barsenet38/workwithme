const {
  PrismaClient,
  UserRole,
  EmploymentType,
  EmploymentStatus,
  LeaveStatus,
  PayrollStatus,
} = require("@prisma/client");
const bcrypt = require("bcrypt");

require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD || "password123", 10);

  // --- Companies ---
  const companiesData = [
    {
      name: "Acme Corp",
      subdomain: "acme",
      description: "Test company for HR system",
      contactEmail: "hr@acme.com",
      phone: "+1-555-123-4567",
      address: { street: "123 Main St", city: "Metropolis", state: "CA", zipCode: "90001", country: "USA" },
      subscriptionPlan: "pro",
      billingEmail: "billing@acme.com",
      status: "active",
      currentPeriodEnd: new Date("2026-01-01"),
    },
    {
      name: "Globex Inc",
      subdomain: "globex",
      description: "Another company for testing",
      contactEmail: "hr@globex.com",
      phone: "+1-555-987-6543",
      address: { street: "456 Elm St", city: "Springfield", state: "IL", zipCode: "62704", country: "USA" },
      subscriptionPlan: "standard",
      billingEmail: "billing@globex.com",
      status: "active",
      currentPeriodEnd: new Date("2026-01-01"),
    },
    {
      name: "Initech",
      subdomain: "initech",
      description: "Software company for seeding data",
      contactEmail: "hr@initech.com",
      phone: "+1-555-555-1212",
      address: { street: "789 Oak St", city: "Silicon Valley", state: "CA", zipCode: "94043", country: "USA" },
      subscriptionPlan: "pro",
      billingEmail: "billing@initech.com",
      status: "active",
      currentPeriodEnd: new Date("2026-01-01"),
    },
  ];

  const companies = [];
  for (const companyData of companiesData) {
    const company = await prisma.company.upsert({
      where: { name: companyData.name },
      update: {},
      create: companyData,
    });
    companies.push(company);
  }
  console.log(`✅ Created ${companies.length} companies`);

  // --- SuperAdmin ---
const superAdmin = await prisma.user.upsert({
  where: { email: "superadmin@hrsystem.com" },
  update: {},
  create: {
    companyId: companies[0].id,
    email: "superadmin@hrsystem.com",
    passwordHash,
    role: UserRole.SUPERADMIN,
    firstName: "Super",
    lastName: "Admin",
    position: "System Administrator",
    employmentType: EmploymentType.FULL_TIME,
    status: EmploymentStatus.ACTIVE,
    employeeId: "EMP-SUPER-001",
    dateHired: new Date("2022-01-01"),
  },
});
  console.log("✅ SuperAdmin created:", superAdmin.email);

  // --- Company Settings ---
  const companySettings = [];
  for (const company of companies) {
    const settings = await prisma.companySettings.upsert({
      where: { companyId: company.id },
      update: {},
      create: {
        companyId: company.id,
        passwordMinLength: 8,
        passwordRequireSpecial: true,
        passwordRequireNumber: true,
        passwordExpiryDays: null,
        sessionTimeoutMinutes: 480,
        twoFactorEnabled: false,
        defaultAnnualLeaveDays: 20,
        carryOverLeaveDays: 5,
        probationPeriodDays: 90,
        workingDays: [1, 2, 3, 4, 5],
        dailyWorkingHours: 8.0,
        overtimeEnabled: true,
        automaticLeaveAccrual: true,
      },
    });
    companySettings.push(settings);
  }
  console.log(`✅ Created ${companySettings.length} company settings`);

  // --- Departments ---
  const deptNames = ["Human Resources", "IT", "Engineering", "Sales", "Marketing"];
  const allDepartments = [];

  for (const company of companies) {
    for (const name of deptNames) {
      const dept = await prisma.department.upsert({
        where: { companyId_name: { companyId: company.id, name } },
        update: {},
        create: {
          companyId: company.id,
          name,
          description: `${name} department`,
        },
      });
      allDepartments.push({ ...dept, companyId: company.id });
    }
  }
  console.log(`✅ Created ${allDepartments.length} departments`);

  // --- Users ---
  const users = [];

  for (const company of companies) {
    const companyDepts = allDepartments.filter((d) => d.companyId === company.id);

    // Admin
    const admin = await prisma.user.upsert({
      where: { email: `admin@${company.subdomain}.com` },
      update: {},
      create: {
        companyId: company.id,
        email: `admin@${company.subdomain}.com`,
        passwordHash,
        role: UserRole.ADMIN,
        firstName: "Admin",
        lastName: company.name.split(" ")[0],
        position: "HR Administrator",
        employmentType: EmploymentType.FULL_TIME,
        status: EmploymentStatus.ACTIVE,
        employeeId: `EMP-${company.subdomain}-001`,
        departmentId: companyDepts.find((d) => d.name === "Human Resources")?.id,
        dateHired: new Date("2022-01-01"),
      },
    });
    users.push(admin);

    // Manager
    const manager = await prisma.user.upsert({
      where: { email: `manager@${company.subdomain}.com` },
      update: {},
      create: {
        companyId: company.id,
        email: `manager@${company.subdomain}.com`,
        passwordHash,
        role: UserRole.MANAGER,
        firstName: "Manager",
        lastName: company.name.split(" ")[0],
        position: "Team Manager",
        employmentType: EmploymentType.FULL_TIME,
        status: EmploymentStatus.ACTIVE,
        employeeId: `EMP-${company.subdomain}-002`,
        departmentId: companyDepts.find((d) => d.name === "Engineering")?.id,
        dateHired: new Date("2022-06-01"),
      },
    });
    users.push(manager);

    // Employees
    const employeeData = [
      { firstName: "Alice", lastName: "Dev", position: "Software Engineer", deptName: "Engineering" },
      { firstName: "Bob", lastName: "Designer", position: "UI/UX Designer", deptName: "Engineering" },
      { firstName: "Charlie", lastName: "Sales", position: "Sales Rep", deptName: "Sales" },
      { firstName: "Dana", lastName: "Marketer", position: "Marketing Specialist", deptName: "Marketing" },
    ];

    for (let i = 0; i < employeeData.length; i++) {
      const emp = employeeData[i];
      const user = await prisma.user.upsert({
        where: { email: `${emp.firstName.toLowerCase()}@${company.subdomain}.com` },
        update: {},
        create: {
          companyId: company.id,
          email: `${emp.firstName.toLowerCase()}@${company.subdomain}.com`,
          passwordHash,
          role: UserRole.EMPLOYEE,
          firstName: emp.firstName,
          lastName: emp.lastName,
          position: emp.position,
          employmentType: EmploymentType.FULL_TIME,
          status: EmploymentStatus.ACTIVE,
          employeeId: `EMP-${company.subdomain}-00${i + 3}`,
          departmentId: companyDepts.find((d) => d.name === emp.deptName)?.id,
          managerId: manager.id,
          dateHired: new Date(`2023-0${i + 1}-15`),
        },
      });
      users.push(user);
    }
  }
  console.log(`✅ Created ${users.length} users`);

  // --- Leave Types ---
  const leaveTypes = ["Annual Leave", "Sick Leave", "Maternity Leave"];
  const allLeaveTypes = [];

  for (const company of companies) {
    for (const name of leaveTypes) {
      const leave = await prisma.leaveType.upsert({
        where: { companyId_name: { companyId: company.id, name } },
        update: {},
        create: {
          companyId: company.id,
          name,
          description: `${name} for ${company.name}`,
          allowanceDays: name === "Annual Leave" ? 20 : 10,
          color: "#3B82F6",
          isPaid: true,
          requiresApproval: true,
        },
      });
      allLeaveTypes.push({ ...leave, companyId: company.id });
    }
  }
  console.log(`✅ Created ${allLeaveTypes.length} leave types`);

  // --- Leave Balances ---
  const leaveBalances = [];
  for (const user of users) {
    const companyLeaveTypes = allLeaveTypes.filter((lt) => lt.companyId === user.companyId);
    for (const leaveType of companyLeaveTypes) {
      const balance = await prisma.leaveBalance.upsert({
        where: { userId_leaveTypeId_year: { userId: user.id, leaveTypeId: leaveType.id, year: 2025 } },
        update: {},
        create: {
          userId: user.id,
          leaveTypeId: leaveType.id,
          balance: leaveType.allowanceDays,
          accrued: leaveType.allowanceDays,
          used: 0,
          year: 2025,
        },
      });
      leaveBalances.push(balance);
    }
  }
  console.log(`✅ Created ${leaveBalances.length} leave balances`);

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