// src/routes/ManagerRoutes.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /manager/managerdashboard
router.get("/managerdashboard", async (req, res) => {
  try {
    const managerId = req.query.managerId;
    const companyId = req.query.companyId;

    if (!managerId || !companyId) {
      return res
        .status(400)
        .json({ success: false, message: "managerId and companyId are required" });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // --- Employees in the team ---
    const employees = await prisma.user.findMany({
      where: {
        role: "EMPLOYEE",
        companyId: companyId,
        managerId: managerId,
      },
    });

    // --- Attendance today ---
    const presentToday = await prisma.attendance.count({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        status: "PRESENT",
        user: {
          companyId: companyId,
          managerId: managerId,
        },
      },
    });

    // --- Pending leave requests ---
    const pendingApprovals = await prisma.leaveRequest.count({
      where: {
        status: "PENDING",
        user: {
          companyId: companyId,
          managerId: managerId,
        },
      },
    });

    const pendingLeaveRequestsRaw = await prisma.leaveRequest.findMany({
      where: {
        status: "PENDING",
        user: {
          companyId: companyId,
          managerId: managerId,
        },
      },
      include: { user: true, leaveType: true },
    });

    const pendingLeaveRequests = pendingLeaveRequestsRaw.map((r) => ({
      id: r.id,
      employeeName: `${r.user.firstName} ${r.user.lastName}`,
      leaveType: { name: r.leaveType.name, color: r.leaveType.color || "blue" },
      startDate: r.startDate,
      endDate: r.endDate,
      duration:
        Math.ceil(
          (new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1,
    }));

    // --- Example performance breakdown ---
    const performanceBreakdown = [
      { metric: "Quality", value: 85, color: "green" },
      { metric: "Efficiency", value: 70, color: "blue" },
      { metric: "Teamwork", value: 90, color: "purple" },
    ];

    // --- Example quick actions ---
    const quickActions = [
      { id: 1, title: "Manage Users", description: "Add or remove team members", icon: "Users", color: "cyan" },
      { id: 2, title: "Review Requests", description: "Approve pending leave", icon: "Calendar", color: "blue" },
      { id: 3, title: "View Reports", description: "Check performance reports", icon: "BarChart3", color: "green" },
      { id: 4, title: "Set Targets", description: "Define team goals", icon: "Target", color: "purple" },
    ];

    res.json({
      success: true,
      data: {
        teamOverview: {
          teamSize: employees.length,
          presentToday,
          pendingApprovals,
          averagePerformance: 82,
        },
        pendingLeaveRequests,
        performanceBreakdown,
        quickActions,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
