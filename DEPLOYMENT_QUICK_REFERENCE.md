# DEPLOYMENT QUICK REFERENCE CARD

## 3-Step Deployment (Copy & Paste)

### Step 1: Test Locally
```bash
npm run build && npm start
# Visit: http://localhost:5000
# Press Ctrl+C to stop
```

### Step 2: Get MongoDB Connection String
1. Go to: https://mongodb.com/cloud/atlas
2. Create free account → M0 cluster
3. Create database user (save username/password)
4. Whitelist `0.0.0.0/0` for IP
5. Get connection string from "Connect" button

**Format:** 
```
mongodb+srv://username:password@cluster.mongodb.net/realestate_db?retryWrites=true&w=majority
```

### Step 3: Deploy to Render
1. Go to: https://render.com
2. Sign up with GitHub
3. New Web Service → Select repository
4. **Build Command:** `npm install && npm run build`
5. **Start Command:** `npm start`
6. Add these 9 environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/realestate_db...
JWT_ACCESS_SECRET=<random-32-chars>
JWT_REFRESH_SECRET=<different-random-32-chars>
NODE_ENV=production
ALLOW_REGISTRATION=true
BCRYPT_SALT_ROUNDS=12
SEED_ADMIN=false
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=TempPass@123
```

7. Click **Deploy** → Wait 3-5 minutes
8. Get your URL: `https://your-app.onrender.com`

---

## Generate Random Strings

### MacOS/Linux:
```bash
openssl rand -hex 32
# Run twice for both JWT secrets
```

### Windows PowerShell:
```powershell
-join ((0..31) | ForEach-Object { '{0:x1}' -f (Get-Random -Maximum 16) })
# Run twice for both JWT secrets
```

### Online Generator:
https://www.uuidgenerator.net/random

---

## Verification URLs

After deployment, test these:

```
Health check:    https://your-app.onrender.com/api/health
Homepage:        https://your-app.onrender.com
Admin Login:     https://your-app.onrender.com/admin/login
Admin Panel:     https://your-app.onrender.com/admin/projects
API Projects:    https://your-app.onrender.com/api/projects
```

---

## Files You Modified

| File | What Changed |
|------|-------------|
| `server.js` | ✅ Serves `dist/` + SPA fallback |
| `package.json` | ✅ Added `start` script |
| `.env.example` | ✅ MongoDB variables |

---

## Environment Variables Needed

| Variable | Example | Notes |
|----------|---------|-------|
| `MONGODB_URI` | `mongodb+srv://...` | From MongoDB Atlas |
| `JWT_ACCESS_SECRET` | `a1b2c3d4...` | Random 32+ chars |
| `JWT_REFRESH_SECRET` | `z9y8x7w6...` | Different from above |
| `NODE_ENV` | `production` | Must be "production" |
| `ALLOW_REGISTRATION` | `true` | Allow signup |
| `BCRYPT_SALT_ROUNDS` | `12` | Password hash rounds |
| `SEED_ADMIN` | `false` | Don't reseed after 1st deploy |
| `DEFAULT_ADMIN_EMAIL` | `admin@example.com` | Your email |
| `DEFAULT_ADMIN_PASSWORD` | `TempPass@123` | Change after login |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Run `npm run build` locally to test |
| MongoDB won't connect | Check IP whitelist is `0.0.0.0/0` |
| Frontend won't load | Verify `npm run build` creates `dist/` folder |
| API 404 errors | Check routes mounted in `server.js` |
| Can't login | Verify tokens in localStorage (F12) |

---

## Key URLs

- **GitHub**: https://github.com/yourusername/your-repo
- **MongoDB Atlas**: https://mongodb.com/cloud/atlas
- **Render Dashboard**: https://dashboard.render.com
- **Live App**: https://your-app.onrender.com

---

## Deployment Checklist

- [ ] Local build works: `npm run build && npm start`
- [ ] MongoDB Atlas account created
- [ ] Database user created with password
- [ ] IP whitelist set to `0.0.0.0/0`
- [ ] Connection string copied
- [ ] Render account created
- [ ] Service created with correct commands
- [ ] All 9 env vars added to Render
- [ ] Deploy clicked
- [ ] Build completed (check logs)
- [ ] Health check returns OK
- [ ] Homepage loads
- [ ] Admin login works
- [ ] Can create/edit/delete resources

---

## After Deployment

1. Change default admin password
2. Set `SEED_ADMIN=false` in Render env
3. Test all features work
4. Monitor logs for errors
5. Keep MongoDB connection string secure

---

## Documentation Files

- **DEPLOYMENT_SUMMARY.md** - Overview of everything
- **DEPLOYMENT_QUICKSTART.md** - 30-minute guide
- **RENDER_DEPLOYMENT.md** - Step-by-step (detailed)
- **LOCAL_TESTING.md** - How to test locally
- **DEPLOYMENT_CHECKLIST.md** - Pre-deployment checklist

Read in order above for complete understanding.

---

## Support Links

- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev)

---

## Estimated Time

- Build & Test: 5 min
- MongoDB Setup: 10 min
- Render Setup: 10 min
- Deploy: 5 min
- Verify: 5 min
- **Total: ~35 minutes**

---

## You're Ready to Deploy! 🚀

Follow the 3-Step Deployment at the top of this card.

Questions? Check the documentation files listed above.
