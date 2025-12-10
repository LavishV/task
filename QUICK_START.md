# Quick Start Guide

Get the Real Estate Agency application up and running in 5 minutes!

## Prerequisites Check

- [ ] Node.js installed (v14+)
- [ ] PostgreSQL installed and running
- [ ] Git installed

## Setup (5 minutes)

### 1. Database Setup (2 minutes)

Open PostgreSQL terminal:
```bash
psql -U postgres
```

Run these commands:
```sql
CREATE DATABASE realestate_db;
CREATE USER realestate WITH PASSWORD 'password123';
ALTER ROLE realestate WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE realestate_db TO realestate;
\q
```

### 2. Project Setup (3 minutes)

```bash
# Install dependencies
npm install

# The .env file is pre-configured, just verify:
# - DB_HOST: localhost
# - DB_USER: realestate
# - DB_PASSWORD: password123
# - DB_NAME: realestate_db
```

## Running the Application

### Terminal 1 - Start Backend
```bash
npm run server
```

Wait for: `Server is running on http://localhost:5000`

### Terminal 2 - Start Frontend
```bash
npm run dev
```

Wait for: `Local: http://localhost:5173/`

## Access Points

| What | URL | Description |
|------|-----|-------------|
| Landing Page | http://localhost:5173/ | Public website |
| Admin Panel | http://localhost:5173/admin | Manage content |
| API Status | http://localhost:5000/api/health | Backend health check |

## Try It Out

### 1. Add a Project
1. Go to http://localhost:5173/admin/projects
2. Click "Add Project"
3. Fill in:
   - Name: "Modern Office Building"
   - Description: "A beautiful modern office space"
   - Upload an image
4. Click "Create Project"
5. Go to landing page - project appears in "Our Projects"

### 2. Add a Client
1. Go to http://localhost:5173/admin/clients
2. Click "Add Client"
3. Fill in:
   - Name: "John Smith"
   - Designation: "CEO"
   - Description: "Great experience working with this company"
   - Upload an image
4. Click "Create Client"
5. Go to landing page - client appears in "Happy Clients"

### 3. Submit Contact Form
1. Go to http://localhost:5173/
2. Scroll to "Get a Free Consultation" form
3. Fill in and submit
4. Go to http://localhost:5173/admin/contact
5. Your submission appears in the table

### 4. Subscribe to Newsletter
1. Go to http://localhost:5173/
2. Scroll to footer
3. Enter email and click "Subscribe"
4. Go to http://localhost:5173/admin/newsletter
5. Your email appears in subscribers list

## Common Tasks

### View All Submissions
```
Admin Panel → Contact Submissions
```

### View All Subscribers
```
Admin Panel → Newsletter Subscribers
Export CSV for mailing list
```

### Delete Content
1. Go to desired admin section
2. Click trash icon next to item
3. Confirm deletion

### Change API URL
Edit `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting

### "Cannot connect to database"
```bash
# Check PostgreSQL is running
# macOS: brew services list | grep postgres
# Windows: Check Services app for PostgreSQL
# Linux: sudo systemctl status postgresql
```

### "Port 5000 already in use"
```bash
# Change PORT in .env to 5001
PORT=5001
```

### "Port 5173 already in use"
```bash
# Vite will automatically use next available port
# Check terminal output for actual port
```

### Images not uploading
```bash
# Create uploads directory
mkdir -p uploads
chmod 755 uploads
```

## File Structure

```
├── server.js              ← Start here for backend
├── src/App.tsx            ← Frontend router
├── server/models/         ← Database schemas
├── server/routes/         ← API endpoints
├── src/components/        ← React components
├── src/pages/             ← Page components
├── src/hooks/             ← Custom hooks
└── .env                   ← Configuration
```

## API Endpoints

```
GET    /api/projects          Get all projects
POST   /api/projects          Create project (with image)
DELETE /api/projects/:id      Delete project

GET    /api/clients           Get all clients
POST   /api/clients           Create client (with image)
DELETE /api/clients/:id       Delete client

GET    /api/contact           Get all submissions
POST   /api/contact           Submit contact form
DELETE /api/contact/:id       Delete submission

GET    /api/newsletter        Get all subscribers
POST   /api/newsletter        Subscribe to newsletter
DELETE /api/newsletter/:id    Delete subscriber
```

## Next Steps

1. **Customize**
   - Update company name in Header
   - Change colors in tailwind.config.js
   - Update hero image and content

2. **Add More Features**
   - Search and filters
   - Advanced admin dashboard
   - Email notifications
   - Analytics

3. **Deploy**
   - See DEPLOYMENT.md for production setup
   - Heroku, AWS, Azure, Google Cloud supported

4. **Version Control**
   - `git init`
   - Create GitHub/GitLab/Bitbucket repo
   - Push code

## Documentation

- **Full Setup**: See [SETUP.md](./SETUP.md)
- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Architecture**: See [README.md](./README.md)

## Support

Having issues? Check:
1. Terminal error messages
2. Browser console (F12)
3. SETUP.md troubleshooting section
4. README.md for full documentation

---

**You're all set!** Start building amazing properties! 🎉
