import type { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Middleware to verify admin role
export const verifyAdmin = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret") as any;

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      res.status(403).json({ error: 'Access denied. Admin role required.' });
      return;
    }

    next();
  } catch (err) {
    console.error('Error verifying admin:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 1. User Management Endpoints
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Prisma.UserWhereInput = search
      ? {
        OR: [
          { firstName: { contains: search as string, mode: 'insensitive' } },
          { lastName: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
          { employeeId: { contains: search as string, mode: 'insensitive' } }
        ]
      }
      : {};


    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          department: true,
          company: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'];
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: 'Invalid role provided' });
      return;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      include: {
        department: true,
        company: true
      }
    });

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 2. Billing & Subscription Endpoints
export const getBillingInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = req.params.companyId;

    const billing = await prisma.billing.findUnique({
      where: { companyId },
      include: {
        company: true,
        invoices: {
          orderBy: { issueDate: 'desc' },
          take: 5
        }
      }
    });

    if (!billing) {
      res.status(404).json({ error: 'Billing information not found' });
      return;
    }

    res.json({
      success: true,
      data: billing
    });
  } catch (err) {
    console.error('Error fetching billing info:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId } = req.params;
    const { plan, status, seats } = req.body;

    const billing = await prisma.billing.update({
      where: { companyId },
      data: {
        plan,
        status,
        seats
      },
      include: {
        company: true
      }
    });

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      data: billing
    });
  } catch (err) {
    console.error('Error updating subscription:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 3. Company Settings Endpoints
export const getCompanySettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = req.params.companyId;

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        settings: true,
        departments: true,
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    if (!company) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }

    res.json({
      success: true,
      data: company
    });
  } catch (err) {
    console.error('Error fetching company settings:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCompanySettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId } = req.params;
    const settings = req.body;

    const company = await prisma.company.update({
      where: { id: companyId },
      data: {
        settings: {
          upsert: {
            create: settings,
            update: settings
          }
        }
      },
      include: {
        settings: true
      }
    });

    res.json({
      success: true,
      message: 'Company settings updated successfully',
      data: company
    });
  } catch (err) {
    console.error('Error updating company settings:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 4. Analytics Endpoints
export const getSystemAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { timeframe = 'month' } = req.query;

    // Calculate date range based on timeframe
    const now = new Date();
    let startDate = new Date();

    switch (timeframe) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    const [
      userCount,
      activeUsers,
      newUsers,
      departmentStats,
      loginStats
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          lastLogin: {
            gte: startDate
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      prisma.department.findMany({
        include: {
          _count: {
            select: { users: true }
          }
        }
      }),
      prisma.loginHistory.groupBy({
        by: ['date'],
        where: {
          date: {
            gte: startDate
          }
        },
        _count: {
          id: true
        },
        orderBy: {
          date: 'asc'
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        userCount,
        activeUsers,
        newUsers,
        departmentStats,
        loginActivity: loginStats
      }
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 5. Integrations Endpoints
export const getIntegrations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId } = req.params;

    const integrations = await prisma.integration.findMany({
      where: { companyId },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: integrations
    });
  } catch (err) {
    console.error('Error fetching integrations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateIntegration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { integrationId } = req.params;
    const { status, config } = req.body;

    const integration = await prisma.integration.update({
      where: { id: integrationId },
      data: {
        status,
        config
      }
    });

    res.json({
      success: true,
      message: 'Integration updated successfully',
      data: integration
    });
  } catch (err) {
    console.error('Error updating integration:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 6. Security Endpoints
export const getSecuritySettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId } = req.params;

    const securitySettings = await prisma.securitySettings.findUnique({
      where: { companyId },
      include: {
        company: true
      }
    });

    if (!securitySettings) {
      res.status(404).json({ error: 'Security settings not found' });
      return;
    }

    res.json({
      success: true,
      data: securitySettings
    });
  } catch (err) {
    console.error('Error fetching security settings:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSecuritySettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId } = req.params;
    const settings = req.body;

    const securitySettings = await prisma.securitySettings.upsert({
      where: { companyId },
      create: {
        companyId,
        ...settings
      },
      update: settings,
      include: {
        company: true
      }
    });

    res.json({
      success: true,
      message: 'Security settings updated successfully',
      data: securitySettings
    });
  } catch (err) {
    console.error('Error updating security settings:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, action, userId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (action) where.action = action;
    if (userId) where.userId = userId;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { timestamp: 'desc' }
      }),
      prisma.auditLog.count({ where })
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get current company ID from the authenticated user
export const getCurrentCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret") as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { companyId: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      companyId: user.companyId
    });
  } catch (err) {
    console.error('Error fetching company:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get billing for current company
export const getCurrentCompanyBilling = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret") as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { companyId: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const billing = await prisma.billing.findUnique({
      where: { companyId: user.companyId },
      include: {
        company: true,
        invoices: {
          orderBy: { issueDate: 'desc' },
          take: 5
        }
      }
    });

    res.json({
      success: true,
      data: billing
    });
  } catch (err) {
    console.error('Error fetching billing:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Similar endpoints for settings, integrations, etc. that use the current company ID