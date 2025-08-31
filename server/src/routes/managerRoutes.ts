import express from 'express';
import {
  verifyManager,
  getManagerDashboard,
  getTeamMembers,
  getPendingLeaveRequests,
  updateLeaveRequestStatus
} from '../controllers/managerController.js';

const router = express.Router();

// Apply manager verification middleware to all routes
router.use(verifyManager);

// Manager dashboard routes
router.get('/dashboard', getManagerDashboard);    
router.get('/team-members', getTeamMembers);
router.get('/leave-requests/pending', getPendingLeaveRequests);
router.patch('/leave-requests/:requestId/status', updateLeaveRequestStatus);

export default router;