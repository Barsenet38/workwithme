// routes/approvals.js
const express = require("express");
const router = express.Router();
const { PrismaClient, LeaveStatus } = require("@prisma/client");

const prisma = new PrismaClient();

// GET all leave requests for a manager
router.get("/", async (req, res) => {
  const { managerId, companyId } = req.query;

  if (!managerId || !companyId) {
    return res.status(400).json({ success: false, message: "ManagerId and CompanyId are required" });
  }

  try {
    const requests = await prisma.leaveRequest.findMany({
      where: {
        user: {
          managerId: managerId,
          companyId: companyId,
        },
      },
      include: {
        user: true,
        leaveType: true,
        approvedBy: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error fetching leave requests" });
  }
});

// GET a single leave request by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = await prisma.leaveRequest.findUnique({
      where: { id },
      include: { user: true, leaveType: true, approvedBy: true },
    });

    if (!request) return res.status(404).json({ success: false, message: "Leave request not found" });

    res.json({ success: true, data: request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error fetching leave request" });
  }
});

// POST approve or reject a leave request
router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { approve, comments } = req.body;
  const managerId = req.body.managerId; // pass managerId from frontend (or decode from token)

  if (typeof approve !== "boolean") {
    return res.status(400).json({ success: false, message: "Approve must be boolean" });
  }

  try {
    const request = await prisma.leaveRequest.findUnique({ where: { id } });
    if (!request) return res.status(404).json({ success: false, message: "Leave request not found" });

    if (request.status !== LeaveStatus.PENDING) {
      return res.status(400).json({ success: false, message: "Leave request already processed" });
    }

    const updated = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status: approve ? LeaveStatus.APPROVED : LeaveStatus.REJECTED,
        approvedById: managerId,
        approvedAt: new Date(),
        comments: comments || (approve ? "Approved" : "Rejected"),
      },
      include: { user: true, leaveType: true, approvedBy: true },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error updating leave request" });
  }
});

module.exports = router;
