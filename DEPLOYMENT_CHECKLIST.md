# Deployment Checklist

Use this checklist to ensure everything is ready before deploying to Render.

## Pre-Deployment (Local)

### Code Quality
- [ ] `npm run build` succeeds without errors
- [ ] `npm run typecheck` passes (no TypeScript errors)
- [ ] `npm run lint` passes (no ESLint errors)
- [ ] No console errors or warnings in browser DevTools
- [ ] All API endpoints respond correctly locally

### Database
- [ ] MongoDB Atlas cluster created (M0 free tier)
- [ ] Database user created with strong password
- [ ] Network IP whitelist includes `0.0.0.0/0`
- [ ] Connection string verified and tested
- [ ] Test: Can connect with `mongosh "your-connection-string"`

### Environment Variables
- [ ] `.env` file created (copied from `.env.example`)
- [ ] `MONGODB_URI` set to your Atlas connection string
- [ ] `JWT_ACCESS_SECRET` is a random 32+ character string
- [ ] `JWT_REFRESH_SECRET` is a different random 32+ character string
- [ ] `NODE_ENV` set to `development` for local testing
- [ ] `.env` is in `.gitignore` (never commit secrets)

### Frontend Build
- [ ] `npm run build` creates `dist/` folder with:
  - [ ] `dist/index.html` (main entry point)
  - [ ] `dist/assets/` folder with CSS and JS bundles
- [ ] `server.js` includes code to serve `dist/` folder:
  ```javascript
  app.use(express.static(pathModule.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(pathModule.join(__dirname, 'dist', 'index.html'));
  });
  ```

### Frontend Routes
- [ ] ProtectedRoute component prevents unauthorized access to `/admin/*`
- [ ] Login redirects to `/admin/login` when not authenticated
- [ ] Logout clears tokens and redirects to login page
- [ ] SPA routing works (all pages accessible after login)

### Backend Configuration
- [ ] `package.json` has these scripts:
  ```json
  "build": "vite build",
  "start": "npm run build && npm run server",
  "server": "node server.js"
  ```
- [ ] All API routes properly mounted in `server.js`:
  - [ ] `/api/auth` - Authentication endpoints
  - [ ] `/api/projects` - Project CRUD
  - [ ] `/api/clients` - Client testimonials
  - [ ] `/api/contact` - Contact form submissions
  - [ ] `/api/newsletter` - Newsletter subscriptions
- [ ] Authentication middleware protects admin endpoints:
  - [ ] POST/PUT/DELETE require valid JWT
  - [ ] GET endpoints public where appropriate
- [ ] CORS is enabled (should handle Render origin automatically)

### Authentication System
- [ ] Admin model uses bcrypt password hashing
- [ ] Login validates email and password
- [ ] JWT tokens generated correctly
- [ ] Refresh token mechanism works
- [ ] Token expiry times set correctly:
  - [ ] Access: 15 minutes
  - [ ] Refresh: 7 days
- [ ] Rate limiting works:
  - [ ] Login: 20 attempts per 15 minutes
  - [ ] Registration: 5 attempts per hour
- [ ] Account lockout after 5 failed attempts

### Testing (Complete LOCAL_TESTING.md checks)
- [ ] Health endpoint: `GET /api/health` → `{"status":"OK"}`
- [ ] Landing page loads with all sections
- [ ] Admin login form works
- [ ] Admin signup form works
- [ ] Can create/read/update/delete projects
- [ ] Can create/read/update/delete clients
- [ ] Contact form submits successfully
- [ ] Newsletter subscription works
- [ ] Testimonials carousel auto-scrolls
- [ ] File uploads work (if implemented)
- [ ] Tokens refresh automatically on 401

### Git/GitHub
- [ ] No uncommitted changes: `git status` shows clean
- [ ] All sensitive data removed (no `.env` committed)
- [ ] `.gitignore` includes: `.env`, `node_modules/`, `dist/`, `.DS_Store`, etc.
- [ ] Latest code pushed to GitHub: `git push origin main`
- [ ] No large files in repository (over 100MB)

---

## MongoDB Atlas Setup

### Account & Cluster
- [ ] Account created at mongodb.com/cloud/atlas
- [ ] M0 Free cluster created
- [ ] Cluster status is "ACTIVE"
- [ ] Database name: `realestate_db`

### Database User
- [ ] User created with strong password
- [ ] Username: recorded securely
- [ ] Password: recorded securely (not in code!)
- [ ] Role: "Atlas Admin" or "Database Admin"

### Network Access
- [ ] IP Whitelist configured
- [ ] `0.0.0.0/0` (Allow Access from Anywhere) added
- [ ] Status shows "ACTIVE"

### Connection
- [ ] Connection string obtained from "Connect" button
- [ ] Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
- [ ] String tested locally with mongosh or similar
- [ ] String matches exactly in `MONGODB_URI`

---

## Render Platform Setup

### Account & Repository
- [ ] Render account created at render.com
- [ ] Connected GitHub account to Render
- [ ] Repository selected and connected

### Service Configuration
- [ ] Service name set (e.g., `realestate-app`)
- [ ] Environment selected: **Node**
- [ ] Build command set: `npm install && npm run build`
- [ ] Start command set: `npm start`
- [ ] Instance type selected: **Free** (for testing)
- [ ] Auto-deploy on push: enabled (optional)

### Environment Variables (Render Dashboard)
These MUST be set before deploying:
- [ ] `MONGODB_URI` - Your Atlas connection string
- [ ] `JWT_ACCESS_SECRET` - Random 32+ character string
- [ ] `JWT_REFRESH_SECRET` - Different random 32+ character string
- [ ] `NODE_ENV` - Set to `production`
- [ ] `ALLOW_REGISTRATION` - Set to `true`
- [ ] `BCRYPT_SALT_ROUNDS` - Set to `12`
- [ ] `SEED_ADMIN` - Set to `false` (or `true` only first time)
- [ ] `DEFAULT_ADMIN_EMAIL` - Your admin email
- [ ] `DEFAULT_ADMIN_PASSWORD` - Your temporary admin password
- [ ] `PORT` - Can leave empty (Render provides via $PORT)
- [ ] `VITE_API_URL` - Set to `/api`

**⚠️ SECURITY:** Never use same secrets as development!

### Pre-Deployment Review
- [ ] All required env vars set
- [ ] No typos in variable names
- [ ] Connection string verified one last time
- [ ] Settings reviewed for correctness
- [ ] Ready to click "Deploy"

---

## Deployment & Monitoring

### Initial Deployment
- [ ] Clicked "Deploy" button
- [ ] Monitoring **Logs** tab for build progress
- [ ] Build command running: `npm install` → `npm run build`
- [ ] Start command ready to execute: `npm start`
- [ ] Deployment completes (3-5 minutes typical)
- [ ] Service shows "Live" status
- [ ] Render assigned URL noted: `https://your-app.onrender.com`

### Post-Deployment Verification
- [ ] Health check passes: `GET /your-app.onrender.com/api/health`
- [ ] Landing page loads: `GET /your-app.onrender.com`
- [ ] Admin login page accessible: `/admin/login`
- [ ] Can login with provided credentials
- [ ] Can access admin panel after login
- [ ] Can create/edit/delete resources
- [ ] Database connections show in logs
- [ ] No error messages in Render logs

### Smoke Tests (Quick verification)
- [ ] Landing page hero section visible
- [ ] Projects section populated
- [ ] Testimonials carousel auto-scrolls
- [ ] Contact form submits
- [ ] Admin login/logout works
- [ ] Admin CRUD operations work
- [ ] No CORS errors
- [ ] No 404 errors
- [ ] Images load correctly
- [ ] CSS styling applied correctly

---

## Post-Deployment

### Security
- [ ] Change default admin password immediately
- [ ] Update `DEFAULT_ADMIN_PASSWORD` in Render env (for future deploys)
- [ ] Verify no sensitive data in logs
- [ ] Enable auto-redeploy on GitHub push (optional)

### Monitoring
- [ ] Set up monitoring notifications (if available)
- [ ] Check logs regularly for errors
- [ ] Monitor database storage usage
- [ ] Test functionality weekly

### Optional Enhancements
- [ ] Add custom domain (if available on plan)
- [ ] Set up SSL certificate (automatic on Render)
- [ ] Configure error logging service
- [ ] Set up backup strategy for MongoDB
- [ ] Add error monitoring (Sentry, etc.)

### Documentation
- [ ] Update project README with live URL
- [ ] Document admin credentials (store securely)
- [ ] Create runbook for common operations
- [ ] Document any custom deployment steps

---

## Troubleshooting Reference

If deployment fails, check:

| Issue | Check |
|-------|-------|
| Build fails | See error in Render logs, check `npm run build` locally |
| MongoDB won't connect | Verify connection string, whitelist IPs, credentials |
| Port already in use | Not applicable on Render (auto-handled) |
| Frontend not loading | Verify `dist/` built and `server.js` serves it |
| API 404 errors | Verify routes mounted in `server.js` |
| CORS errors | Check middleware order, CORS should be first |
| Authentication fails | Verify JWT secrets match between local and Render |
| Env vars not set | Check Render dashboard, not local `.env` |

---

## Completion

✅ When ALL items above are checked:
- Your application is deployment-ready
- Render deployment should succeed
- All features should work in production
- You can confidently share the live URL

🎉 **Your app is live!**

---

## Quick Links

- 📖 [Complete Render Deployment Guide](./RENDER_DEPLOYMENT.md)
- 🧪 [Local Testing Guide](./LOCAL_TESTING.md)
- 📋 [Setup Instructions](./SETUP.md)
- ⚡ [Quick Start Guide](./QUICK_START.md)
- 📚 [Project Summary](./PROJECT_SUMMARY.md)
