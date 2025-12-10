# Local Testing Before Deployment

Follow these steps to test your full application locally before deploying to Render.

## Prerequisites

- Node.js installed (v18+)
- MongoDB Atlas account and database URL ready
- All environment variables in `.env` file

## Step 1: Set Up Environment Variables

Create a `.env` file in your project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
# Your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/realestate_db?retryWrites=true&w=majority

# Generate random strings for these (or use placeholders for testing)
JWT_ACCESS_SECRET=your-test-access-secret-12345678901234567890
JWT_REFRESH_SECRET=your-test-refresh-secret-12345678901234567890

# Rest can stay as defaults
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
SEED_ADMIN=true
DEFAULT_ADMIN_EMAIL=admin@test.com
DEFAULT_ADMIN_PASSWORD=TestAdmin@123
ALLOW_REGISTRATION=true
NODE_ENV=development
VITE_API_URL=http://localhost:5000/api
PORT=5000
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Test Production Build

This tests the entire build and server startup process (same as Render):

```bash
npm run build && npm start
```

Expected output:
```
vite v7.2.7 building client environment for production...
✓ built in 4.63s

✓ MongoDB connected successfully
✓ Default admin created
  Email: admin@test.com
  Username: admin
  Password: TestAdmin@123
✓ Server is running on http://localhost:5000
```

Once running, test these URLs:

### 4.1 Health Check
```
GET http://localhost:5000/api/health
```
Should return:
```json
{"status":"OK"}
```

### 4.2 Landing Page
```
GET http://localhost:5000/
```
Should show your homepage with projects and testimonials

### 4.3 Admin Login Page
```
GET http://localhost:5000/admin/login
```
Should display login form

### 4.4 Admin Login API
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "TestAdmin@123"
}
```
Should return:
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "...",
    "email": "admin@test.com",
    "username": "admin",
    "role": "admin"
  }
}
```

## Step 4: Development Testing (Optional)

If you want to develop with hot reload:

Terminal 1 (Frontend with Vite dev server):
```bash
npm run dev
```
- Runs on http://localhost:5173
- Auto-reload on file changes
- Makes requests to http://localhost:5000/api

Terminal 2 (Backend):
```bash
npm run server
```
- Runs on http://localhost:5000
- Serves API endpoints

## Step 5: Test All Features

### Authentication
- [ ] Admin signup: POST /api/auth/register
- [ ] Admin login: POST /api/auth/login
- [ ] Token refresh: POST /api/auth/refresh
- [ ] Get current user: GET /api/auth/me (needs auth header)
- [ ] Logout: POST /api/auth/logout (needs auth header)

### Projects
- [ ] List all: GET /api/projects (public)
- [ ] Create: POST /api/projects (requires admin auth)
- [ ] Update: PUT /api/projects/:id (requires admin auth)
- [ ] Delete: DELETE /api/projects/:id (requires admin auth)

### Clients
- [ ] List all: GET /api/clients (public)
- [ ] Create: POST /api/clients (requires admin auth)
- [ ] Update: PUT /api/clients/:id (requires admin auth)
- [ ] Delete: DELETE /api/clients/:id (requires admin auth)

### Contact Form
- [ ] Submit: POST /api/contact (public)
- [ ] List submissions: GET /api/contact (public for now)

### Newsletter
- [ ] Subscribe: POST /api/newsletter (public)

### File Uploads
- [ ] Upload image: POST /api/projects with file (requires admin auth)
- [ ] Access uploaded: GET /uploads/filename

## Step 6: Test Frontend UI

In browser, visit http://localhost:5000/

1. **Landing Page**
   - [ ] Hero section visible
   - [ ] Projects carousel loads
   - [ ] Testimonials auto-scroll
   - [ ] Contact form visible
   - [ ] Newsletter subscription visible

2. **Admin Login**
   - [ ] Navigate to /admin/login
   - [ ] Email field works
   - [ ] Password field works
   - [ ] Login button submits form
   - [ ] Error messages show on invalid input
   - [ ] Successful login redirects to /admin/projects

3. **Admin Signup**
   - [ ] Navigate to /admin/signup
   - [ ] All fields validate
   - [ ] Password strength requirements enforced
   - [ ] Successful signup logs in user

4. **Admin Projects Page**
   - [ ] Shows all projects
   - [ ] Can add new project
   - [ ] Can edit existing project
   - [ ] Can delete project
   - [ ] Can upload project image

5. **Admin Clients Page**
   - [ ] Shows all clients
   - [ ] Can add new client
   - [ ] Can edit existing client
   - [ ] Can delete client

6. **Admin Contact Page**
   - [ ] Shows all contact submissions
   - [ ] Can mark as read/unread (if implemented)
   - [ ] Can delete submission

7. **Admin Newsletter Page**
   - [ ] Shows all subscribers
   - [ ] Can search/filter subscribers
   - [ ] Can export subscriber list (if implemented)

## Step 7: Verify Build Output

Check that dist/ folder was created correctly:

```bash
ls dist/
```

Should contain:
```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-*.css     # Compiled CSS
│   └── index-*.js      # Compiled JavaScript
└── vite.svg            # Static assets
```

## Step 8: Database Verification

Connect to your MongoDB Atlas cluster:

1. Go to MongoDB Atlas dashboard
2. Click "Database" → "Browse Collections"
3. Verify you see collections:
   - `admins` - Should have 1 entry (the seeded admin)
   - `projects` - Check your created projects
   - `clients` - Check your client testimonials
   - `contactsubmissions` - Check contact form entries
   - `newslettersubscriptions` - Check newsletter signups

## Troubleshooting Local Testing

### "Cannot find module 'dist'"
- Run `npm run build` first to create dist folder
- Verify build output shows "✓ built in X.XXs"

### "MongoDB connection failed"
- Check `MONGODB_URI` in `.env` is correct
- Verify MongoDB Atlas network whitelist includes your IP
- Test connection string: `mongosh "your-connection-string"`

### "Port 5000 already in use"
- Kill the process: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)
- Or change PORT in `.env` to unused port

### "CORS error when making API requests"
- Should not happen - server.js has CORS enabled
- Check browser console for actual error message
- Verify frontend uses `/api/...` (relative URLs)

### "Admin not seeding"
- Check `SEED_ADMIN=true` in `.env`
- Check `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD` in `.env`
- Check MongoDB shows admin in `admins` collection
- Try manually creating admin via signup page instead

### "API requests return 401 Unauthorized"
- Login first to get tokens
- Verify tokens stored in localStorage (DevTools → Application → Local Storage)
- Verify Authorization header is sent (check Network tab)
- Token may have expired - refresh or login again

## Success Criteria

Your deployment is ready when:

✅ `npm run build && npm start` succeeds  
✅ `/api/health` returns OK  
✅ Landing page loads with all sections  
✅ Admin login/signup works  
✅ Can create/edit/delete projects  
✅ Can upload project images  
✅ Contact form submits successfully  
✅ Newsletter subscription works  
✅ Token refresh works (no unexpected logouts)  
✅ Admin pages require authentication  
✅ No CORS errors in console  
✅ Database shows created data  

Once all these pass, you're ready to deploy to Render!

---

## Next Steps

When ready to deploy:
1. Follow `RENDER_DEPLOYMENT.md`
2. Set same environment variables on Render
3. Push latest code to GitHub
4. Deploy to Render (takes 3-5 minutes)
5. Run same tests against production URL
