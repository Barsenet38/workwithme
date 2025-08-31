import express from 'express';
import {
  verifyAdmin,
  getUsers,
  updateUserRole,
  getBillingInfo,
  updateSubscription,
  getCompanySettings,
  updateCompanySettings,
  getSystemAnalytics,
  getIntegrations,
  updateIntegration,
  getSecuritySettings,
  updateSecuritySettings,
  getAuditLogs,getCurrentCompanyBilling, 
} from '../controllers/adminController.js';

const router = express.Router();

// Apply admin verification middleware to all routes
router.use(verifyAdmin);

// User management routes
router.get('/users', getUsers);
router.patch('/users/:userId/role', updateUserRole);

// Billing routes
router.get('/billing/:companyId', getBillingInfo);
router.patch('/billing/:companyId/subscription', updateSubscription);

// Company settings routes
router.get('/company/:companyId/settings', getCompanySettings);
router.put('/company/:companyId/settings', updateCompanySettings);

// Analytics routes
router.get('/analytics', getSystemAnalytics);

// Integration routes
router.get('/integrations/:companyId', getIntegrations);
router.patch('/integrations/:integrationId', updateIntegration);

// Security routes
router.get('/security/:companyId', getSecuritySettings);
router.put('/security/:companyId', updateSecuritySettings);
router.get('/audit-logs', getAuditLogs);
router.get('/billing/current-company', getCurrentCompanyBilling);
router.get('/company/current-company/settings', getCompanySettings);
router.get('/integrations/current-company', getCompanySettings);
router.get('/security/current-company', getCompanySettings);
export default router;