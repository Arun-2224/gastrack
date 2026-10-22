import { Router } from 'express';
import {
  getCylinders,
  getCylinderById,
  getCylinderHistory,
  getCylinderMovements,
  getCylinderStats,
  createCylinder,
  updateCylinder,
  transitionStatus,
  bulkTransition,
} from '../controllers/cylinderController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getCylinders);
router.get('/stats', getCylinderStats);
router.get('/:id', getCylinderById);
router.get('/:id/history', getCylinderHistory);
router.get('/:id/movements', getCylinderMovements);

router.post(
  '/',
  authorize('ADMIN', 'MANAGER', 'INVENTORY_STAFF'),
  createCylinder
);

router.put(
  '/:id',
  authorize('ADMIN', 'MANAGER', 'INVENTORY_STAFF', 'MAINTENANCE_STAFF'),
  updateCylinder
);

router.post(
  '/:id/status',
  authorize('ADMIN', 'MANAGER', 'INVENTORY_STAFF', 'DELIVERY_STAFF', 'MAINTENANCE_STAFF'),
  transitionStatus
);

router.post(
  '/bulk-status',
  authorize('ADMIN', 'MANAGER', 'INVENTORY_STAFF'),
  bulkTransition
);

export default router;
