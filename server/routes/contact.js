import express from 'express';
import {
  getContactSubmissions,
  createContactSubmission,
  deleteContactSubmission,
} from '../controllers/contactController.js';
import { authenticateJWT, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected GET route (admin only)
router.get('/', authenticateJWT, authorizeRole('admin'), getContactSubmissions);

// Public POST route (anyone can submit)
router.post('/', createContactSubmission);

// Protected DELETE route (admin only)
router.delete('/:id', authenticateJWT, authorizeRole('admin'), deleteContactSubmission);

export default router;
