# Deployment Guide

This guide covers deploying the Real Estate Agency Application to various cloud platforms.

## Deployment Options

### Option 1: Heroku (Recommended for Quick Deployment)

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps

1. **Create a Heroku App**
```bash
heroku create your-app-name
```

2. **Add PostgreSQL Addon**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

3. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set DB_DIALECT=postgres
```

The database credentials will be automatically set from the PostgreSQL addon.

4. **Update package.json scripts for production**
The `npm run server` script should start the Express server.

5. **Deploy**
```bash
git push heroku main
```

6. **Access your app**
```bash
heroku open
```

---

### Option 2: Railway.app (Simple and Modern)

#### Prerequisites
- Railway account
- GitHub repository

#### Steps

1. **Connect GitHub**
- Sign in to Railway.app
- Create a new project
- Select "Deploy from GitHub"
- Authorize and select your repository

2. **Configure PostgreSQL**
- Add PostgreSQL service
- Service will automatically be linked

3. **Set Environment Variables**
In Railway dashboard:
- `NODE_ENV`: production
- `PORT`: 5000
- Database variables will be auto-populated

4. **Deploy**
- Push changes to GitHub
- Railway auto-deploys on push

5. **Access your app**
- Get URL from Railway dashboard

---

### Option 3: AWS (Elastic Beanstalk + RDS)

#### Prerequisites
- AWS account
- AWS CLI installed
- EB CLI installed

#### Backend Deployment Steps

1. **Initialize Elastic Beanstalk**
```bash
eb init -p node.js-18 realestateapi --region us-east-1
```

2. **Create Environment**
```bash
eb create realestateapi-env
```

3. **Create RDS PostgreSQL Instance**
- Use AWS RDS console
- Note connection details

4. **Set Environment Variables**
```bash
eb setenv \
  DB_HOST=your-rds-endpoint \
  DB_USER=postgres \
  DB_PASSWORD=your-password \
  DB_NAME=realestate_db \
  NODE_ENV=production
```

5. **Deploy**
```bash
eb deploy
```

#### Frontend Deployment (S3 + CloudFront)

1. **Build Frontend**
```bash
npm run build
```

2. **Create S3 Bucket**
```bash
aws s3 mb s3://your-realestate-frontend
```

3. **Upload Build**
```bash
aws s3 sync dist/ s3://your-realestate-frontend/
```

4. **Create CloudFront Distribution**
- Use AWS CloudFront console
- Set S3 bucket as origin
- Configure CORS for API calls

---

### Option 4: Azure App Service

#### Prerequisites
- Azure account
- Azure CLI installed

#### Steps

1. **Create Resource Group**
```bash
az group create --name realestategroup --location eastus
```

2. **Create App Service Plan**
```bash
az appservice plan create --name realestateplan --resource-group realestategroup --sku B1 --is-linux
```

3. **Create Web App**
```bash
az webapp create --resource-group realestategroup --plan realestateplan --name realestateapi --runtime "NODE|18.0"
```

4. **Create PostgreSQL Database**
```bash
az postgres server create --resource-group realestategroup --name realestatedb --admin-user dbadmin --admin-password YourPassword123!
```

5. **Configure Connection String**
```bash
az webapp config appsettings set --resource-group realestategroup --name realestateapi --settings \
  DB_HOST=realestatedb.postgres.database.azure.com \
  DB_USER=dbadmin@realestatedb \
  DB_PASSWORD=YourPassword123! \
  DB_NAME=realestate_db
```

6. **Deploy from GitHub**
- Use Azure DevOps or GitHub Actions
- Configure CI/CD pipeline

---

### Option 5: Google Cloud App Engine

#### Prerequisites
- Google Cloud account
- Google Cloud SDK installed

#### Steps

1. **Initialize**
```bash
gcloud app create
```

2. **Create Cloud SQL Instance**
```bash
gcloud sql instances create realestate-db --database-version=POSTGRES_14
```

3. **Create app.yaml**
```yaml
runtime: nodejs18

env: standard

env_variables:
  NODE_ENV: "production"
  CLOUD_SQL_CONNECTION_NAME: "your-project:us-central1:realestate-db"
```

4. **Deploy**
```bash
gcloud app deploy
```

---

## Database Migration

### Option 1: Managed Database (Recommended)

Use your cloud provider's managed PostgreSQL service:
- Heroku PostgreSQL
- Azure Database for PostgreSQL
- AWS RDS for PostgreSQL
- Google Cloud SQL

Benefits:
- Automatic backups
- High availability
- Automatic patching

### Option 2: Self-Managed PostgreSQL

Host PostgreSQL on a VM (EC2, Compute Engine, etc.):

```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb realestate_db
sudo -u postgres psql -c "CREATE USER realestate WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "ALTER ROLE realestate WITH CREATEDB;"
```

---

## Environment Variables for Production

Create `.env` file with production values:

```env
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=realestate_db
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
DB_DIALECT=postgres

# Frontend API URL (for CORS)
VITE_API_URL=https://your-api-domain.com/api
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended for React Apps)

1. **Push code to GitHub**
2. **Connect GitHub to Vercel**
3. **Set environment variable**
   - `VITE_API_URL`: Your backend API URL
4. **Deploy** - Automatic on push

### Option 2: Netlify

1. **Build frontend**
```bash
npm run build
```

2. **Connect GitHub to Netlify**

3. **Set Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variable: `VITE_API_URL`

4. **Deploy** - Automatic on push

### Option 3: S3 + CloudFront

1. **Build frontend**
```bash
npm run build
```

2. **Upload to S3**
```bash
aws s3 sync dist/ s3://your-bucket-name/
```

3. **Create CloudFront distribution**
4. **Point domain to CloudFront**

---

## CORS Configuration

Update `server.js` for production domains:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend-domain.com',
    'http://localhost:3000', // Development
  ],
  credentials: true,
}));
```

---

## SSL/TLS Certificates

Use Let's Encrypt with your domain provider:

```bash
# For Node.js on Linux
sudo apt-get install certbot
sudo certbot certonly --standalone -d your-domain.com
```

Or use your cloud provider's certificate service:
- AWS Certificate Manager
- Azure Key Vault
- Google Certificate Manager

---

## Monitoring and Logging

### Application Monitoring
- Heroku: Built-in logs via `heroku logs`
- Railway: Built-in dashboard
- AWS CloudWatch
- Google Cloud Logging

### Database Monitoring
- Cloud provider dashboards
- Connection pool monitoring
- Query performance analysis

---

## Backup Strategy

1. **Database Backups**
   - Automated daily backups (most cloud providers)
   - Weekly full backups
   - Monthly archive

2. **File Uploads Backups**
   - S3 with versioning enabled
   - Regular snapshots
   - Separate backup bucket

---

## Performance Optimization

1. **Enable caching**
```javascript
app.use(express.static('uploads', {
  maxAge: '1d',
  etag: false
}));
```

2. **Use CDN for static assets**
3. **Enable GZIP compression**
```javascript
import compression from 'compression';
app.use(compression());
```

4. **Database connection pooling**
- Already configured in Sequelize

---

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify DB credentials
   - Check firewall/security groups
   - Test connection string

2. **CORS Errors**
   - Check origin in cors configuration
   - Verify API_URL in frontend

3. **File Upload Errors**
   - Check uploads directory permissions
   - Verify disk space
   - Check file size limits

4. **Slow Performance**
   - Check database queries
   - Enable caching
   - Use CDN for static assets

---

## Maintenance

### Regular Tasks

1. **Update dependencies**
```bash
npm audit
npm update
```

2. **Monitor logs** - Daily or weekly

3. **Check backups** - Verify successful backups

4. **Performance review** - Monitor API response times

5. **Security updates** - Apply patches promptly

---

## Support

For issues with specific platforms:
- Heroku: https://devcenter.heroku.com/
- Railway: https://docs.railway.app/
- AWS: https://docs.aws.amazon.com/
- Azure: https://docs.microsoft.com/azure/
- Google Cloud: https://cloud.google.com/docs/
