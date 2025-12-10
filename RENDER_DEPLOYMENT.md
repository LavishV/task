# Deploying to Render - Complete Guide

This guide walks you through deploying your full-stack Real Estate application (frontend + backend) to Render.

## Prerequisites

- GitHub account with your project pushed
- MongoDB Atlas account (free tier)
- Render account (connect with GitHub)

---

## Step 1: Set Up MongoDB Atlas (5-10 minutes)

### 1.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click **Sign Up** and create an account (use Google/GitHub or email)
3. Complete the welcome survey

### 1.2 Create a Free M0 Cluster
1. Click **Build a Database**
2. Select the **Free** tier (M0)
3. Choose your preferred cloud provider (AWS recommended)
4. Select a region closest to you
5. Click **Create Cluster** (takes 2-3 minutes)

### 1.3 Create Database User
1. In the left sidebar, click **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Set **Username**: `lavishverma` (or your choice)
5. Set **Password**: Use a strong password (e.g., `MySecure@Password123`)
6. Click **Add User**

### 1.4 Configure Network Access
1. In the left sidebar, click **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere**
   - This sets the whitelist to `0.0.0.0/0` (required for Render)
4. Click **Confirm**

### 1.5 Get Connection String
1. Click **Databases** in the left sidebar
2. Click **Connect** on your cluster
3. Select **Drivers** → **Node.js**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/realestate_db?retryWrites=true&w=majority
   ```
5. Replace `username` and `password` with your database user credentials
6. Replace `realestate_db` at the end (this becomes your database name)

**Example:**
```
mongodb+srv://lavishverma:MySecure@Password123@cluster-xyz.mongodb.net/realestate_db?retryWrites=true&w=majority
```

---

## Step 2: Prepare Your Project (2 minutes)

### 2.1 Verify Configuration Files
Ensure these files are properly set up in your project root:

✅ `package.json` - Has `build` and `start` scripts:
```json
{
  "scripts": {
    "build": "vite build",
    "start": "npm run build && npm run server",
    "server": "node server.js"
  }
}
```

✅ `.env.example` - Template with all required variables (never commit `.env`)

✅ `server.js` - Updated to serve frontend build from `dist/` folder

✅ `.gitignore` - Includes `.env` (verify `.env` is never committed)

### 2.2 Verify GitHub Push
```bash
git status
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## Step 3: Deploy to Render (15 minutes)

### 3.1 Create New Web Service
1. Go to [render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Click **Connect a repository**
4. Select your GitHub repository
5. Click **Connect**

### 3.2 Configure Deployment
Fill in the form with these settings:

| Field | Value |
|-------|-------|
| **Name** | `realestate-app` (or your app name) |
| **Environment** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (for testing) |

### 3.3 Add Environment Variables
1. Scroll down to **Environment** section
2. Add each variable by clicking **Add Environment Variable**

**Required Variables:**
- `MONGODB_URI`: Your connection string from Step 1.5
- `JWT_ACCESS_SECRET`: Generate a random string (32+ chars recommended)
  - Use: `openssl rand -hex 32` in terminal, or paste a strong password
- `JWT_REFRESH_SECRET`: Generate another random string (different from above)
- `NODE_ENV`: `production`
- `PORT`: `5000` (Render will override this)
- `ALLOW_REGISTRATION`: `true`
- `BCRYPT_SALT_ROUNDS`: `12`
- `SEED_ADMIN`: `false` (set to `true` only to create default admin on first deploy)
- `DEFAULT_ADMIN_EMAIL`: `admin@yourdomain.com`
- `DEFAULT_ADMIN_PASSWORD`: Your temporary admin password

**Example setup:**
```
MONGODB_URI: mongodb+srv://lavishverma:MySecure@Password123@cluster-xyz.mongodb.net/realestate_db?retryWrites=true&w=majority
JWT_ACCESS_SECRET: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
JWT_REFRESH_SECRET: z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0
NODE_ENV: production
ALLOW_REGISTRATION: true
BCRYPT_SALT_ROUNDS: 12
SEED_ADMIN: false
DEFAULT_ADMIN_EMAIL: admin@yourdomain.com
DEFAULT_ADMIN_PASSWORD: TempPass@2024
```

### 3.4 Deploy
1. Scroll to the bottom and click **Deploy**
2. Wait for the build to complete (3-5 minutes on first deployment)
3. Watch the **Logs** tab for any errors
4. Once complete, Render assigns you a URL: `https://realestate-app.onrender.com`

---

## Step 4: Test Your Deployment (10 minutes)

### 4.1 Health Check
1. Visit: `https://realestate-app.onrender.com/api/health`
2. Should see: `{"status":"OK"}`

### 4.2 Test Landing Page
1. Visit: `https://realestate-app.onrender.com`
2. Should see your home page with projects and testimonials

### 4.3 Test Admin Panel
1. Visit: `https://realestate-app.onrender.com/admin/login`
2. If `SEED_ADMIN=true` in env vars, use:
   - Email: `admin@yourdomain.com` (or your DEFAULT_ADMIN_EMAIL)
   - Password: Your DEFAULT_ADMIN_PASSWORD
3. If `SEED_ADMIN=false`, use `/admin/signup` to create a new account
4. After login, you should see `/admin/projects` page

### 4.4 Test CRUD Operations
1. **Create**: Add a new project from admin panel
2. **Read**: Verify it appears on landing page
3. **Update**: Edit the project
4. **Delete**: Remove it

### 4.5 Test Public Features
- [ ] Submit contact form
- [ ] Subscribe to newsletter
- [ ] View projects carousel
- [ ] View testimonials carousel

---

## Step 5: Common Issues & Troubleshooting

### "Cannot find module 'dist'"
**Cause:** Build didn't run or failed
**Fix:** Check build logs in Render dashboard under **Logs** tab
- Verify `vite build` command succeeds locally: `npm run build`
- Check for TypeScript errors: `npm run typecheck`

### "MongooseError: failed to connect to MongoDB"
**Cause:** Invalid connection string or IP not whitelisted
**Fix:**
1. Verify IP whitelist in MongoDB Atlas: **Network Access** → See `0.0.0.0/0`
2. Test connection string locally before deploying
3. Ensure no typos in `MONGODB_URI`

### "Cannot POST /api/projects"
**Cause:** Routes not properly registered
**Fix:** 
1. Verify routes are imported in `server.js`
2. Restart Render deployment: Click **Manual Deploy** → **Deploy latest commit**

### "CORS error" or "Cannot connect to API"
**Cause:** CORS misconfigured (less likely - should work)
**Fix:** Check that frontend makes requests to `/api/...` (relative URLs)
- Verify in `src/services/api.ts` uses: `const API_URL = '/api'`

### Build takes too long or fails
**Cause:** Dependencies not installed correctly
**Fix:**
1. Verify `package.json` has all required dependencies
2. Clear Render cache: **Settings** → **Clear Cache** → **Clear All**
3. Trigger rebuild: **Manual Deploy** → **Deploy latest commit**

### "Cannot access /admin/login" page
**Cause:** Frontend build not being served
**Fix:** Verify `server.js` has these lines at the END:
```javascript
app.use(express.static(pathModule.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(pathModule.join(__dirname, 'dist', 'index.html'));
});
```

---

## Step 6: After Deployment

### 6.1 Update Your Admin Password
1. Log in to admin panel with default credentials
2. Go to your user profile (if available) or use admin panel
3. Change password to something secure
4. Update `DEFAULT_ADMIN_PASSWORD` in Render environment variables

### 6.2 Disable Admin Seeding
1. In Render dashboard, go to **Environment**
2. Change `SEED_ADMIN` from `true` to `false`
3. Click **Save Changes** → **Redeploy**

### 6.3 Enable Custom Domain (Optional)
1. In Render dashboard, click **Settings**
2. Scroll to **Custom Domain**
3. Enter your domain (e.g., `realestate.com`)
4. Add DNS records as shown in Render instructions
5. Verify domain activation

---

## Step 7: Monitoring & Maintenance

### View Logs
- Dashboard → **Logs** tab → See all server messages and errors

### Restart Service
- Dashboard → **Manual Deploy** → **Deploy latest commit**

### Update Environment Variables
- Dashboard → **Environment** → Edit and Save
- Service auto-restarts after changes

### Monitor Database
- MongoDB Atlas → **Monitoring** tab
- Check storage usage (free tier = 512MB max)
- Monitor connection metrics

---

## Quick Reference: Deploy Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user and password set
- [ ] Network IP whitelist set to `0.0.0.0/0`
- [ ] MongoDB connection string copied
- [ ] `package.json` has correct scripts
- [ ] `server.js` serves frontend from `dist/`
- [ ] `.env` file ignored in `.gitignore`
- [ ] Latest code pushed to GitHub
- [ ] Render service created with correct build/start commands
- [ ] All environment variables added to Render
- [ ] Deployment successful (check logs)
- [ ] Health check `/api/health` returns OK
- [ ] Landing page loads correctly
- [ ] Admin login works
- [ ] CRUD operations work
- [ ] Public features work

---

## Support & Resources

**If something fails:**
1. Check Render **Logs** tab for error messages
2. Run `npm run build` locally to test build process
3. Check MongoDB Atlas **Monitoring** for connection issues
4. Verify all environment variables are set correctly
5. Look for detailed error messages in Render logs

**Useful Links:**
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Support](https://docs.atlas.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev)

---

**Your app should now be live!** 🎉

Visit your Render URL to see your application in production.
