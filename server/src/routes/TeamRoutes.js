const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// --- GET all team members for a manager ---
router.get("/", async (req, res) => {
  try {
    const { managerId, companyId } = req.query;

    if (!managerId || !companyId) {
      return res.status(400).json({ success: false, message: "managerId and companyId are required" });
    }

    const teamMembers = await prisma.user.findMany({
      where: {
        managerId,
        companyId,
        role: "EMPLOYEE",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        position: true,
        department: { select: { name: true } },
        status: true,
      },
    });

    res.json({ success: true, data: teamMembers });
  } catch (err) {
    console.error("Error fetching team:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- POST add team member ---
router.post("/add", async (req, res) => {
  try {
    const { managerId, companyId, firstName, lastName, email, position, departmentId } = req.body;
    if (!managerId || !companyId || !firstName || !lastName || !email) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        position,
        companyId,
        managerId,
        role: "EMPLOYEE",
        departmentId,
        passwordHash: "hashed_default_password", // TODO: hash properly
        status: "ACTIVE",
      },
    });

    res.json({ success: true, data: newUser });
  } catch (err) {
    console.error("Error adding team member:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// --- GET single team member ---
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { managerId, companyId } = req.query;

    if (!managerId || !companyId) {
      return res.status(400).json({ success: false, message: "managerId and companyId are required" });
    }

const teamMember = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    personalEmail: true,
    avatar: true,
    dateOfBirth: true,
    address: true,
    employeeId: true,
    position: true,
    department: { select: { id: true, name: true } },
    employmentType: true,
    status: true,
    dateHired: true,
    dateTerminated: true,
    manager: { select: { id: true, firstName: true, lastName: true } },
    bankAccount: true,
    taxInfo: true,
    leaveBalances: { include: { leaveType: true } },
    leaveRequests: { include: { leaveType: true, approvedBy: true } },
    attendances: true,
    documents: true,
    payrolls: true,
    performanceReviewsAsReviewee: true,
    performanceReviewsAsReviewer: true,
    createdAt: true,
    updatedAt: true,
  },
});


    if (!teamMember) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    res.json({ success: true, data: teamMember });
  } catch (err) {
    console.error("Error fetching team member:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// --- PUT update team member ---
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, position, departmentId, status } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { firstName, lastName, email, position, departmentId, status },
    });

    res.json({ success: true, data: updatedUser });
  } catch (err) {
    console.error("Error updating team member:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- DELETE team member ---
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({ where: { id } });

    res.json({ success: true, message: "Team member removed" });
  } catch (err) {
    console.error("Error deleting team member:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
