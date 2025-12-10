# 🚀 Deployment Guide - Quick Start

Your full-stack Real Estate application is now production-ready! Here's how to deploy it to Render in 30 minutes.

## What Was Updated

✅ **server.js** - Now serves frontend build from `dist/` folder  
✅ **package.json** - Added `start` and `prod` scripts  
✅ **.env.example** - Updated with MongoDB variables  
✅ **RENDER_DEPLOYMENT.md** - Complete Render deployment guide  
✅ **LOCAL_TESTING.md** - Guide for testing before deployment  
✅ **DEPLOYMENT_CHECKLIST.md** - Comprehensive checklist  

---

## Quick Deployment Steps (3 Commands)

### Step 1: Test Locally (5 minutes)
```bash
# Verify build works
npm run build && npm start
```
- Should see: `✓ built in X.XXs` then `✓ Server is running on http://localhost:5000`
- Visit http://localhost:5000 to verify everything loads
- Press `Ctrl+C` to stop

### Step 2: Set Up MongoDB Atlas (10 minutes)
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign up → Create free M0 cluster
3. Add database user (username/password)
4. Whitelist `0.0.0.0/0` for IP access
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/realestate_db?...`

### Step 3: Deploy to Render (15 minutes)
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **New** → **Web Service**
4. Select your GitHub repository
5. Fill in:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Add environment variables:
   - `MONGODB_URI`: Your connection string from Step 2
   - `JWT_ACCESS_SECRET`: Random string (e.g., `openssl rand -hex 32`)
   - `JWT_REFRESH_SECRET`: Different random string
   - `NODE_ENV`: `production`
   - `ALLOW_REGISTRATION`: `true`
   - `BCRYPT_SALT_ROUNDS`: `12`
7. Click **Deploy**
8. Wait 3-5 minutes for build to complete
9. Get your live URL: `https://your-app.onrender.com`

---

## Verification Checklist

After deployment, verify:

```bash
# 1. Health check
curl https://your-app.onrender.com/api/health
# Should return: {"status":"OK"}

# 2. Visit homepage
https://your-app.onrender.com
# Should show: Projects, testimonials, contact form

# 3. Test login
https://your-app.onrender.com/admin/login
# Use default admin credentials (or signup)

# 4. Test CRUD
# Create/edit/delete a project from admin panel
```

---

## Key Files Modified

| File | Change |
|------|--------|
| `server.js` | Added static file serving + SPA fallback |
| `package.json` | Added `start` and `prod` scripts |
| `.env.example` | Updated with MongoDB variables |

## New Documentation

| File | Purpose |
|------|---------|
| `RENDER_DEPLOYMENT.md` | Step-by-step deployment guide |
| `LOCAL_TESTING.md` | How to test before deploying |
| `DEPLOYMENT_CHECKLIST.md` | Complete pre-deployment checklist |
| `DEPLOYMENT_QUICKSTART.md` | This file! |

---

## Environment Variables (Render Dashboard)

Set these in Render after creating the service:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/realestate_db
JWT_ACCESS_SECRET=<random-string-32-chars>
JWT_REFRESH_SECRET=<different-random-string>
NODE_ENV=production
ALLOW_REGISTRATION=true
BCRYPT_SALT_ROUNDS=12
SEED_ADMIN=false
DEFAULT_ADMIN_EMAIL=admin@yourdomain.com
DEFAULT_ADMIN_PASSWORD=YourTempPassword
VITE_API_URL=/api
```

---

## Common Issues

| Problem | Solution |
|---------|----------|
| Build fails | Check `npm run build` works locally |
| MongoDB won't connect | Verify IP whitelist in Atlas (should be `0.0.0.0/0`) |
| API 404 errors | Ensure routes mounted in `server.js` |
| Frontend not loading | Verify `dist/` folder created and served |
| CORS errors | Should not happen - already configured |

---

## After Deployment

1. **Change admin password** - Don't use default credentials in production
2. **Disable SEED_ADMIN** - Set to `false` in Render env vars
3. **Monitor logs** - Check Render dashboard regularly
4. **Test all features** - Verify CRUD, authentication, uploads

---

## Support Documentation

Detailed guides available:
- 📖 [Complete Render Deployment Guide](./RENDER_DEPLOYMENT.md)
- 🧪 [Local Testing Instructions](./LOCAL_TESTING.md)
- ✅ [Pre-Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- 📚 [Project Setup](./SETUP.md)
- ⚡ [Quick Reference](./QUICK_START.md)

---

## You're Ready! 🎉

Your application is production-ready. Follow the 3 steps above and you'll be live in 30 minutes!

**Questions?** Check the detailed guides linked above.
