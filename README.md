# Real Estate Agency Full Stack Application

A modern full-stack real estate application with a beautiful landing page and comprehensive admin panel. Built with React, TypeScript, Express, and Sequelize.

## Features

### Landing Page
- Beautiful hero section with consultation form
- Dynamic "Our Projects" section fetching from database
- "Happy Clients" testimonials carousel
- Contact form for inquiries
- Newsletter subscription
- Responsive design

### Admin Panel
- **Projects Management**: Add, view, and delete projects with images
- **Clients Management**: Add, view, and delete client testimonials
- **Contact Submissions**: View all contact form submissions
- **Newsletter Subscribers**: View all email subscribers with export to CSV

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router v6 for navigation
- Axios for API calls
- Lucide React for icons

**Backend:**
- Express.js
- Sequelize ORM
- PostgreSQL database
- Multer for file uploads

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd <project-directory>
npm install
```

2. **Configure Environment Variables**
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api

DB_HOST=localhost
DB_PORT=5432
DB_NAME=realestate_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_DIALECT=postgres

NODE_ENV=development
PORT=5000
```

3. **Create Database**
```bash
createdb realestate_db
```

4. **Start the Backend Server**
```bash
npm run server
```

The backend will be available at `http://localhost:5000`

5. **Start the Frontend Development Server** (in another terminal)
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Project Structure

```
├── server/
│   ├── config/
│   │   └── database.js          # Sequelize configuration
│   ├── models/
│   │   ├── Project.js
│   │   ├── Client.js
│   │   ├── ContactSubmission.js
│   │   └── NewsletterSubscription.js
│   ├── controllers/
│   │   ├── projectController.js
│   │   ├── clientController.js
│   │   ├── contactController.js
│   │   └── newsletterController.js
│   └── routes/
│       ├── projects.js
│       ├── clients.js
│       ├── contact.js
│       └── newsletter.js
│
├── src/
│   ├── components/           # React components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Projects.tsx
│   │   ├── HappyClients.tsx
│   │   ├── ContactForm.tsx
│   │   ├── Footer.tsx
│   │   └── AdminLayout.tsx
│   ├── pages/               # Page components
│   │   ├── Landing.tsx
│   │   ├── AdminProjects.tsx
│   │   ├── AdminClients.tsx
│   │   ├── AdminContact.tsx
│   │   └── AdminNewsletter.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useProjects.ts
│   │   ├── useClients.ts
│   │   ├── useContact.ts
│   │   └── useNewsletter.ts
│   ├── services/
│   │   └── api.ts           # API service
│   └── App.tsx
│
├── server.js                # Backend entry point
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (with image upload)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create client (with image upload)
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Contact Submissions
- `GET /api/contact` - Get all submissions
- `POST /api/contact` - Submit contact form
- `DELETE /api/contact/:id` - Delete submission

### Newsletter
- `GET /api/newsletter` - Get all subscriptions
- `POST /api/newsletter` - Subscribe to newsletter
- `DELETE /api/newsletter/:id` - Delete subscription

## Building for Production

### Frontend Build
```bash
npm run build
```

Output will be in the `dist/` directory.

### Backend Deployment
Make sure to set production environment variables and use a production database before deploying.

## Database Schema

### Projects Table
- `id`: UUID (Primary Key)
- `name`: String (required)
- `description`: Text (required)
- `imageUrl`: String
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Clients Table
- `id`: UUID (Primary Key)
- `name`: String (required)
- `designation`: String (required)
- `description`: Text (required)
- `imageUrl`: String
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### ContactSubmissions Table
- `id`: UUID (Primary Key)
- `fullName`: String (required)
- `email`: String (required, validated)
- `mobileNumber`: String (required)
- `city`: String (required)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### NewsletterSubscriptions Table
- `id`: UUID (Primary Key)
- `email`: String (required, unique, validated)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## Features

- Full CRUD operations for projects and clients
- Contact form submission and management
- Newsletter subscription with duplicate prevention
- Image upload and storage
- Responsive admin panel
- Modern, beautiful UI with Tailwind CSS
- TypeScript for type safety
- Proper error handling and validation

## Deployment

This application can be deployed on any platform that supports Node.js and PostgreSQL such as:
- Heroku
- AWS
- Microsoft Azure
- Google Cloud
- DigitalOcean
- Vercel (frontend)
- Railway (backend)

## License

MIT
