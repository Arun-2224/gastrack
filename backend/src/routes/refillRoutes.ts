import { Router } from 'express';
import {
  getRefillPlants,
  createRefillPlant,
  getRefillBatches,
  getRefillBatchById,
  createRefillBatch,
  updateRefillBatchStatus,
} from '../controllers/refillController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/plants', getRefillPlants);
router.post('/plants', authorize('ADMIN', 'MANAGER'), createRefillPlant);

router.get('/batches', getRefillBatches);
router.get('/batches/:id', getRefillBatchById);
router.post('/batches', authorize('ADMIN', 'MANAGER', 'INVENTORY_STAFF'), createRefillBatch);
router.put('/batches/:id/status', authorize('ADMIN', 'MANAGER', 'INVENTORY_STAFF'), updateRefillBatchStatus);

export default router;
