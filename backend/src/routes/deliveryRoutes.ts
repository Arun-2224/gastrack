import { Router } from 'express';
import {
  getDeliveries,
  getDeliveryById,
  createDelivery,
  updateDeliveryStatus,
  getDeliveryStats,
} from '../controllers/deliveryController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getDeliveries);
router.get('/stats', getDeliveryStats);
router.get('/:id', getDeliveryById);

router.post(
  '/',
  authorize('ADMIN', 'MANAGER', 'DELIVERY_STAFF', 'INVENTORY_STAFF'),
  createDelivery
);

router.put(
  '/:id/status',
  authorize('ADMIN', 'MANAGER', 'DELIVERY_STAFF'),
  updateDeliveryStatus
);

export default router;
