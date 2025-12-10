import express from 'express';
import multer from 'multer';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
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
router.get('/', getProjects);

// Protected POST, PUT, DELETE routes (admin only)
router.post('/', authenticateJWT, authorizeRole('admin'), upload.single('image'), createProject);
router.put('/:id', authenticateJWT, authorizeRole('admin'), upload.single('image'), updateProject);
router.delete('/:id', authenticateJWT, authorizeRole('admin'), deleteProject);

export default router;
