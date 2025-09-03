// routes/performance.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// GET all performance reviews for a manager's team
router.get("/", async (req, res) => {
  const { managerId, companyId } = req.query;

  if (!managerId || !companyId) {
    return res.status(400).json({ success: false, message: "ManagerId and CompanyId are required" });
  }

  try {
    const reviews = await prisma.performanceReview.findMany({
      where: {
        OR: [
          { reviewee: { managerId: managerId } },
          { reviewerId: managerId }
        ],
        companyId: companyId
      },
      include: {
        reviewee: {
          include: {
            department: true
          }
        },
        reviewer: true
      },
      orderBy: { reviewDate: "desc" },
    });

    res.json({ success: true, data: reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error fetching performance reviews" });
  }
});

// GET stats for a manager's team
router.get("/stats", async (req, res) => {
  const { managerId, companyId } = req.query;

  if (!managerId || !companyId) {
    return res.status(400).json({ success: false, message: "ManagerId and CompanyId are required" });
  }

  try {
    // Count reviews by status
    const completed = await prisma.performanceReview.count({
      where: { 
        reviewee: { managerId: managerId },
        companyId: companyId,
        isCompleted: true 
      }
    });

    const pending = await prisma.performanceReview.count({
      where: { 
        reviewee: { managerId: managerId },
        companyId: companyId,
        isCompleted: false 
      }
    });

    // Average rating
    const avgRating = await prisma.performanceReview.aggregate({
      where: { 
        reviewee: { managerId: managerId },
        companyId: companyId,
        rating: { not: null }
      },
      _avg: {
        rating: true
      }
    });

    // Reviews by department
    const byDepartment = await prisma.performanceReview.groupBy({
      by: ['revieweeId'],
      where: {
        reviewee: {
          managerId: managerId,
          companyId: companyId
        }
      },
      _count: {
        id: true
      }
    });

    // Format department data
    const departmentData = await Promise.all(
      byDepartment.map(async (review) => {
        const user = await prisma.user.findUnique({
          where: { id: review.revieweeId },
          include: { department: true }
        });
        return {
          name: user?.department?.name || 'Unassigned',
          count: review._count.id,
        };
      })
    );

    // Reviews by rating
    const byRating = await prisma.performanceReview.groupBy({
      by: ['rating'],
      where: {
        reviewee: {
          managerId: managerId,
          companyId: companyId
        },
        rating: { not: null }
      },
      _count: {
        id: true
      }
    });

    const ratingData = byRating.map(rating => ({
      rating: rating.rating,
      count: rating._count.id
    })).sort((a, b) => a.rating - b.rating);

    res.json({
      success: true,
      data: {
        completed,
        pending,
        avgRating: avgRating._avg.rating || 0,
        byDepartment: departmentData,
        byRating: ratingData
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error fetching performance stats" });
  }
});

// GET a single performance review by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const review = await prisma.performanceReview.findUnique({
      where: { id },
      include: {
        reviewee: {
          include: {
            department: true
          }
        },
        reviewer: true
      },
    });

    if (!review) return res.status(404).json({ success: false, message: "Performance review not found" });

    res.json({ success: true, data: review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error fetching performance review" });
  }
});

// POST update a performance review
router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { goals, strengths, improvements, rating, feedback, isCompleted } = req.body;

  try {
    const review = await prisma.performanceReview.findUnique({ where: { id } });
    if (!review) return res.status(404).json({ success: false, message: "Performance review not found" });

    const updated = await prisma.performanceReview.update({
      where: { id },
      data: {
        goals: goals || review.goals,
        strengths: strengths || review.strengths,
        improvements: improvements || review.improvements,
        rating: rating !== undefined ? rating : review.rating,
        feedback: feedback || review.feedback,
        isCompleted: isCompleted !== undefined ? isCompleted : review.isCompleted,
        completedAt: isCompleted ? new Date() : review.completedAt
      },
      include: {
        reviewee: {
          include: {
            department: true
          }
        },
        reviewer: true
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error updating performance review" });
  }
});

module.exports = router;