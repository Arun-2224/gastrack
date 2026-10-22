import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Restricted to Admins and Managers for compliance and security
router.get('/', authorize('ADMIN', 'MANAGER'), getAuditLogs);

export default router;
