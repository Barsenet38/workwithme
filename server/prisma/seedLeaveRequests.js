const { PrismaClient, LeaveStatus } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding leave requests...");

  // Get all employees (exclude admins and managers if needed)
  const employees = await prisma.user.findMany({
    where: {
      role: "EMPLOYEE",
    },
    include: {
      company: true,
    },
  });

  for (const emp of employees) {
    // Get leave types for this employee's company
    const leaveTypes = await prisma.leaveType.findMany({
      where: { companyId: emp.companyId },
    });

    for (const leaveType of leaveTypes) {
      // Create a leave request if none exists for this user & leaveType
      const existing = await prisma.leaveRequest.findFirst({
        where: { userId: emp.id, leaveTypeId: leaveType.id },
      });
      if (!existing) {
        await prisma.leaveRequest.create({
          data: {
            userId: emp.id,
            leaveTypeId: leaveType.id,
            startDate: new Date("2025-09-10"),
            endDate: new Date("2025-09-15"),
            reason: `Sample ${leaveType.name} request`,
            status: LeaveStatus.PENDING,
          },
        });
      }
    }
  }

  console.log("✅ Leave requests seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding leave requests:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
