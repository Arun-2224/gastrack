import { Router } from 'express';
import { login, getMe, register, getUsers } from '../controllers/authController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/register', authenticate, authorize('ADMIN'), register);
router.get('/users', authenticate, getUsers);

export default router;
