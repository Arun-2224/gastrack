import { Router } from 'express';
import { getPayments, createPayment, getPaymentStats } from '../controllers/paymentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getPayments);
router.get('/stats', getPaymentStats);

router.post(
  '/',
  authorize('ADMIN', 'MANAGER', 'DELIVERY_STAFF'),
  createPayment
);

export default router;
