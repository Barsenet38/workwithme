import { Request, Response } from "express";
import { prisma } from "../prismaClient.js"; // adjust path if different

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Total employees
    const totalEmployees = await prisma.user.count({
      where: { role: "EMPLOYEE" },
    });

    // Total managers
    const totalManagers = await prisma.user.count({
      where: { role: "MANAGER" },
    });

    // Performance summary (average rating + total reviews)
    const performanceSummary = await prisma.performanceReview.aggregate({
      _avg: { rating: true },
      _count: { id: true },
    });

    // Performance distribution (for charts)
    const performanceDistribution = await prisma.performanceReview.groupBy({
      by: ["rating"],
      _count: { rating: true },
    });

    // Employees by department (for charts)
    const employeesByDept = await prisma.user.groupBy({
      by: ["departmentId"],
      _count: { id: true },
      where: { role: "EMPLOYEE", status: "ACTIVE" },
    });

    res.json({
      totalEmployees,
      totalManagers,
      performanceSummary,
      performanceDistribution,
      employeesByDept,
    });
  } catch (error) {
    console.error("DashboardController Error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
