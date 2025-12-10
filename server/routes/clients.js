import express from 'express';
import multer from 'multer';
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from '../controllers/clientController.js';
import { authenticateJWT, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Public GET route
router.get('/', getClients);

// Protected POST, PUT, DELETE routes (admin only)
router.post('/', authenticateJWT, authorizeRole('admin'), upload.single('image'), createClient);
router.put('/:id', authenticateJWT, authorizeRole('admin'), upload.single('image'), updateClient);
router.delete('/:id', authenticateJWT, authorizeRole('admin'), deleteClient);

export default router;
