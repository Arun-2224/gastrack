import { Router } from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  getCustomerStats,
} from '../controllers/customerController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getCustomers);
router.get('/stats', getCustomerStats);
router.get('/:id', getCustomerById);

router.post(
  '/',
  authorize('ADMIN', 'MANAGER', 'DELIVERY_STAFF', 'INVENTORY_STAFF'),
  createCustomer
);

router.put(
  '/:id',
  authorize('ADMIN', 'MANAGER'),
  updateCustomer
);

export default router;
