import { Router } from 'express';
import {
  getMaintenanceJobs,
  createMaintenanceJob,
  updateMaintenanceStatus,
  getMaintenanceStats,
} from '../controllers/maintenanceController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getMaintenanceJobs);
router.get('/stats', getMaintenanceStats);

router.post(
  '/',
  authorize('ADMIN', 'MANAGER', 'MAINTENANCE_STAFF'),
  createMaintenanceJob
);

router.put(
  '/:id/status',
  authorize('ADMIN', 'MANAGER', 'MAINTENANCE_STAFF'),
  updateMaintenanceStatus
);

export default router;
