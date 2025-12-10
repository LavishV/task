import express from 'express';
import {
  getNewsletterSubscriptions,
  createNewsletterSubscription,
  deleteNewsletterSubscription,
} from '../controllers/newsletterController.js';
import { authenticateJWT, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected GET route (admin only)
router.get('/', authenticateJWT, authorizeRole('admin'), getNewsletterSubscriptions);

// Public POST route (anyone can subscribe)
router.post('/', createNewsletterSubscription);

// Protected DELETE route (admin only)
router.delete('/:id', authenticateJWT, authorizeRole('admin'), deleteNewsletterSubscription);

export default router;
