# Local Development Setup

Follow these steps to set up the project for local development.

## Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - For version control

## Step 1: Install PostgreSQL

### macOS (using Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

### Windows
- Download installer from https://www.postgresql.org/download/windows/
- Run installer and follow prompts
- Remember the password you set for `postgres` user

### Linux (Ubuntu)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql.service
```

## Step 2: Create Database

Open PostgreSQL client:
```bash
psql -U postgres
```

Create database and user:
```sql
CREATE DATABASE realestate_db;
CREATE USER realestate WITH PASSWORD 'password123';
ALTER ROLE realestate WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE realestate_db TO realestate;
\q
```

## Step 3: Clone and Setup Project

```bash
# Clone repository
git clone <your-repo-url>
cd <project-directory>

# Install dependencies
npm install
```

## Step 4: Configure Environment

Create `.env` file in root directory:

```env
VITE_API_URL=http://localhost:5000/api

DB_HOST=localhost
DB_PORT=5432
DB_NAME=realestate_db
DB_USER=realestate
DB_PASSWORD=password123
DB_DIALECT=postgres

NODE_ENV=development
PORT=5000
```

## Step 5: Start Backend Server

In a terminal, run:
```bash
npm run server
```

You should see:
```
Database connected successfully
Database synchronized
Server is running on http://localhost:5000
```

## Step 6: Start Frontend Development Server

In a new terminal, run:
```bash
npm run dev
```

You should see:
```
VITE v5.4.8  ready in XXX ms

➜  Local:   http://localhost:5173/
```

## Step 7: Access the Application

- **Landing Page**: http://localhost:5173/
- **Admin Panel**: http://localhost:5173/admin/projects
- **API Health Check**: http://localhost:5000/api/health

## Testing the Application

### Test Landing Page Features

1. **Projects Section**
   - Go to http://localhost:5173/
   - Scroll to "Our Projects" section
   - You should see any projects you add through admin panel

2. **Contact Form**
   - Fill out and submit contact form
   - Check admin panel → Contact Submissions

3. **Newsletter Subscription**
   - Enter email in footer
   - Check admin panel → Newsletter Subscribers

### Test Admin Panel

1. **Add Project**
   - Go to http://localhost:5173/admin/projects
   - Click "Add Project"
   - Fill form and upload image
   - Should appear on landing page

2. **Add Client**
   - Go to http://localhost:5173/admin/clients
   - Click "Add Client"
   - Fill form and upload image
   - Should appear on landing page

3. **View Submissions**
   - Go to http://localhost:5173/admin/contact
   - View all contact form submissions

4. **View Subscribers**
   - Go to http://localhost:5173/admin/newsletter
   - View all newsletter subscribers
   - Export as CSV

## Troubleshooting

### PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
1. Make sure PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database exists: `psql -U postgres -l`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
1. Change PORT in `.env` to another port (e.g., 5001)
2. Or kill the process using the port:
   - macOS/Linux: `lsof -i :5000` then `kill <PID>`
   - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID>`

### Images Not Uploading
```
Error: ENOENT: no such file or directory
```

**Solution:**
1. Make sure `uploads` directory exists in project root
2. Check directory permissions: `chmod 755 uploads`
3. Verify disk space available

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Make sure backend is running
2. Check `VITE_API_URL` in `.env` matches actual backend URL
3. Verify backend CORS configuration in `server.js`

### TypeScript Errors
```
Property does not exist on type
```

**Solution:**
1. Run type checking: `npm run typecheck`
2. Make sure all imports are correct
3. Check TypeScript configuration in `tsconfig.json`

## Development Tools

### Useful Commands

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Format code (optional)
npm run lint -- --fix

# Build frontend
npm run build

# Preview production build
npm run preview

# Start both frontend and backend
# Terminal 1: npm run server
# Terminal 2: npm run dev
```

### Browser DevTools

1. **React Developer Tools**
   - Chrome/Firefox extension for React debugging
   - Install from respective extension store

2. **Redux DevTools** (if using Redux)
   - Monitor state changes
   - Time-travel debugging

### Database Tools

1. **pgAdmin**
   ```bash
   # Install via Homebrew (macOS)
   brew install pgadmin4
   ```

2. **DBeaver**
   - Download from https://dbeaver.io/
   - Free and feature-rich database tool

## Project Structure Overview

```
/
├── server/                  # Backend code
│   ├── config/             # Database configuration
│   ├── models/             # Sequelize models
│   ├── controllers/        # Route handlers
│   └── routes/             # API routes
├── src/                     # Frontend code
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom hooks
│   ├── services/           # API service
│   └── App.tsx             # Main app component
├── uploads/                # Uploaded images directory
├── dist/                   # Built frontend (created after build)
├── .env                    # Environment variables (create this)
├── package.json            # Dependencies
├── server.js               # Backend entry point
└── vite.config.ts          # Frontend build config
```

## Next Steps

1. **Add Sample Data**
   - Use admin panel to add projects and clients
   - Test with different image types and sizes

2. **Customize Branding**
   - Update company name in Header component
   - Change colors in Tailwind config
   - Update logo

3. **Deploy**
   - See DEPLOYMENT.md for production deployment steps

4. **Version Control**
   - Initialize git: `git init`
   - Create repository on GitHub/GitLab/Bitbucket
   - Push initial commit

## Support

For issues:
1. Check this setup guide
2. Review README.md
3. Check application logs in terminal
4. Verify database connection
5. Review browser console for frontend errors

Happy coding!
