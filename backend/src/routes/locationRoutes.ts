import { Router } from 'express';
import { getLocations, createLocation } from '../controllers/locationController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getLocations);
router.post('/', authorize('ADMIN', 'MANAGER'), createLocation);

export default router;
