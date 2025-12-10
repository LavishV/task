import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './server/config/database.js';
import projectRoutes from './server/routes/projects.js';
import clientRoutes from './server/routes/clients.js';
import contactRoutes from './server/routes/contact.js';
import newsletterRoutes from './server/routes/newsletter.js';
import authRoutes from './server/routes/auth.js';
import Admin from './server/models/Admin.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { mkdir } from 'fs/promises';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

// Auth routes
app.use('/api/auth', authRoutes);

// Resource routes
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Seed default admin if enabled
const seedDefaultAdmin = async () => {
  if (process.env.SEED_ADMIN !== 'true') {
    return;
  }

  try {
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      console.log('Admin already exists, skipping seed');
      return;
    }

    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@12345';
    const admin = new Admin({
      username: 'admin',
      email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@realestate.com',
      password: defaultPassword,
      role: 'admin',
    });

    await admin.save();
    console.log('✓ Default admin created');
    console.log(`  Email: ${admin.email}`);
    console.log(`  Username: ${admin.username}`);
    console.log(`  Password: ${defaultPassword}`);
    console.log('  ⚠️  IMPORTANT: Change this password immediately!');
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

const startServer = async () => {
  try {
    await mkdir('uploads', { recursive: true });

    await connectDB();
    console.log('✓ MongoDB connected successfully');

    // Seed admin if enabled
    await seedDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`✓ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
