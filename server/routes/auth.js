import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateJWT, authorizeRole } from '../middlewares/authMiddleware.js';
import { loginLimiter, registerLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/register', registerLimiter, authController.registerAdmin);
router.post('/login', loginLimiter, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', authenticateJWT, authController.me);
router.post('/revoke-all-sessions', authenticateJWT, authController.revokeAllSessions);

// Admin-only routes
router.post('/unlock/:adminId', authenticateJWT, authorizeRole('super-admin'), authController.unlockAccount);

export default router;
