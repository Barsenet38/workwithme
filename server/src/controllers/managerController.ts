import type { Request, Response } from "express";
import { PrismaClient, LeaveStatus, EmploymentStatus } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Middleware to verify manager role
export const verifyManager = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret") as any;
    
    // Check if user is manager, admin, or HR
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true }
    });
    
    if (!user || !['ADMIN', 'HR', 'MANAGER'].includes(user.role)) {
      res.status(403).json({ error: 'Access denied. Manager role required.' });
      return;
    }
    
    next();
  } catch (err) {
    console.error('Error verifying manager:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get manager dashboard data
export const getManagerDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret") as any;
    
    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { 
        id: true,
        companyId: true,
        departmentId: true,
        role: true 
      }
    });
    
    if (!currentUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get team members based on user role
    let teamMembersWhere: any = { companyId: currentUser.companyId };
    
    if (currentUser.role === 'MANAGER') {
      // For managers, get users in their department
      teamMembersWhere.departmentId = currentUser.departmentId;
      teamMembersWhere.id = { not: currentUser.id }; // Exclude self
    } else if (currentUser.role === 'HR') {
      // For HR, get all active employees
      teamMembersWhere.status = EmploymentStatus.ACTIVE;
    } else if (currentUser.role === 'ADMIN') {
      // For admin, get all users
      teamMembersWhere.status = EmploymentStatus.ACTIVE;
    }

    // Get team members count
    const teamSize = await prisma.user.count({
      where: teamMembersWhere
    });

    // Get today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const presentToday = await prisma.attendance.count({
      where: {
        user: teamMembersWhere,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        status: 'PRESENT'
      }
    });

    // Get pending leave approvals
    const pendingApprovals = await prisma.leaveRequest.count({
      where: {
        user: teamMembersWhere,
        status: LeaveStatus.PENDING
      }
    });

    // Get team performance metrics (simplified)
    const performanceReviews = await prisma.performanceReview.findMany({
      where: {
        reviewee: teamMembersWhere,
        isCompleted: true
      },
      select: {
        rating: true
      }
    });

    const averagePerformance = performanceReviews.length > 0 
      ? Math.round((performanceReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / performanceReviews.length) * 100) / 10
      : 85; // Default value

    // Get pending leave requests details
    const pendingLeaveRequests = await prisma.leaveRequest.findMany({
      where: {
        user: teamMembersWhere,
        status: LeaveStatus.PENDING
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        leaveType: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    // Get team performance breakdown
    const performanceBreakdown = await Promise.all([
      // Project completion rate (simplified)
      { metric: 'Project Completion', value: 85, color: 'cyan' },
      
      // On-time delivery (simplified)
      { metric: 'On Time Delivery', value: 92, color: 'green' },
      
      // Quality score (simplified)
      { metric: 'Quality Score', value: 89, color: 'purple' }
    ]);

    res.json({
      success: true,
      data: {
        teamOverview: {
          teamSize,
          presentToday,
          pendingApprovals,
          averagePerformance
        },
        pendingLeaveRequests: pendingLeaveRequests.map(request => ({
          id: request.id,
          employeeName: `${request.user.firstName} ${request.user.lastName}`,
          leaveType: request.leaveType.name,
          startDate: request.startDate,
          endDate: request.endDate,
          duration: Math.ceil((request.endDate.getTime() - request.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
        })),
        performanceBreakdown,
        quickActions: [
          { id: 1, title: 'Team Roster', description: 'View team members', icon: 'Users', color: 'cyan' },
          { id: 2, title: 'Approve Leave', description: 'Review requests', icon: 'Calendar', color: 'green' },
          { id: 3, title: 'Performance', description: 'Team metrics', icon: 'BarChart3', color: 'blue' },
          { id: 4, title: 'Goals', description: 'Set objectives', icon: 'Target', color: 'purple' }
        ]
      }
    });

  } catch (err) {
    console.error('Error fetching manager dashboard:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get team members for manager
export const getTeamMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret") as any;
    
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { 
        companyId: true,
        departmentId: true,
        role: true 
      }
    });
    
    if (!currentUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    let whereClause: any = { 
      companyId: currentUser.companyId,
      status: EmploymentStatus.ACTIVE
    };
    
    if (currentUser.role === 'MANAGER') {
      whereClause.departmentId = currentUser.departmentId;
    }

    const teamMembers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        position: true,
        employmentType: true,
        dateHired: true,
        department: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        firstName: 'asc'
      }
    });

    res.json({
      success: true,
      data: teamMembers
    });

  } catch (err) {
    console.error('Error fetching team members:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get leave requests for approval
export const getPendingLeaveRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret") as any;
    
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { 
        companyId: true,
        departmentId: true,
        role: true 
      }
    });
    
    if (!currentUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    let teamMembersWhere: any = { 
      companyId: currentUser.companyId,
      status: EmploymentStatus.ACTIVE
    };
    
    if (currentUser.role === 'MANAGER') {
      teamMembersWhere.departmentId = currentUser.departmentId;
    }

    const leaveRequests = await prisma.leaveRequest.findMany({
      where: {
        user: teamMembersWhere,
        status: LeaveStatus.PENDING
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            department: {
              select: {
                name: true
              }
            }
          }
        },
        leaveType: {
          select: {
            name: true,
            color: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: leaveRequests
    });

  } catch (err) {
    console.error('Error fetching pending leave requests:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Approve or reject leave request
export const updateLeaveRequestStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;
    const { status, comments } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be APPROVED or REJECTED' });
      return;
    }

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret") as any;
    
    const leaveRequest = await prisma.leaveRequest.update({
      where: { id: requestId },
      data: {
        status: status as LeaveStatus,
        approvedById: decoded.userId,
        approvedAt: new Date(),
        comments
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        leaveType: {
          select: {
            name: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully`,
      data: leaveRequest
    });

  } catch (err) {
    console.error('Error updating leave request status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};