import { Router } from 'express';
import {
  getInspections,
  createInspection,
  getInspectionStats,
} from '../controllers/inspectionController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getInspections);
router.get('/stats', getInspectionStats);

router.post(
  '/',
  authorize('ADMIN', 'MANAGER', 'MAINTENANCE_STAFF', 'INVENTORY_STAFF'),
  createInspection
);

export default router;
