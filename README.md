# ManufactureCRM

ManufactureCRM is a premium **MERN Stack Business Development Associate (BDA) Team Management Dashboard** designed specifically for manufacturing companies. The application simplifies the management of client relationships, inbound sales leads, custom manufacturing requests, conversion tracking, BDA performance analytics, and follow-up notifications.

---

## 🚀 Key Features

- **Split Hero Landing Page:** Left column renders an interactive CSS-based live dashboard mockup representing actual metrics; right column embeds a responsive card interface for instant BDA authentication and account registration.
- **Glassmorphism Theme:** Elegant modern dark workspace built on slate backdrops, offering a highly responsive dashboard workspace with subtle micro-animations.
- **Interactive Leads Board:** Supports both **Kanban Pipeline Card board** (with quick workflow transition controls) and **Responsive Table lists** (with detailed logs).
- **Automated Client Conversion:** When a Lead is transitioned to the "Closed" stage, the backend automatically converts the lead into an active Client account and triggers congratulations notifications.
- **Dynamic BDA Leaderboard:** Shows BDA rankings, lead assignments, deals closed, and automatically computes efficiency rates based on real-time conversions.
- **Real-Time Notification Center:** Actionable indicators for follow-up reminders, proposal reviews, and system alerts to keep the BDA team aligned.

---

## 📂 Folder Structure

```text
ManufactureCRM/
├── client/                     # React Frontend App
│   ├── src/
│   │   ├── components/         # Modular reusable components
│   │   │   ├── ChartSection.jsx
│   │   │   ├── DashboardCards.jsx
│   │   │   ├── LoginPopup.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── SignupPopup.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global Session Provider
│   │   ├── pages/              # Module Views
│   │   │   ├── Clients.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Leads.jsx
│   │   │   ├── Notifications.jsx
│   │   │   └── Performance.jsx
│   │   ├── services/
│   │   │   └── api.js          # Axios API central configuration
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     # Express Node Backend
│   ├── config/
│   │   └── db.js               # Database Connection configuration
│   ├── controllers/            # Request handlers
│   │   ├── authController.js
│   │   ├── clientController.js
│   │   └── leadController.js
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT Session verifier
│   ├── models/                 # Mongoose Database Schemas
│   │   ├── Client.js
│   │   ├── Lead.js
│   │   ├── Notification.js
│   │   ├── Performance.js
│   │   └── User.js
│   ├── routes/                 # API Endpoint Routers
│   │   ├── authRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── leadRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── performanceRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express Server Entrypoint
│
├── INSTALLATION.md             # Standard developer installation instructions
└── README.md                   # Project overview & reference guide
```

---

## 🛠️ API Routes Reference

All API routes are prefixed with `/api`. Protected routes require a valid JWT passed in the `Authorization: Bearer <token>` header.

### Authentication Endpoints
- **POST** `/auth/signup` - Register a new BDA user.
- **POST** `/auth/login` - Authenticate BDA and retrieve token.

### Leads Endpoints (Protected)
- **GET** `/leads` - Retrieve all leads (BDAs see their own; managers see all).
- **POST** `/leads` - Register a new lead (triggers performance calculation & alerts).
- **PUT** `/leads/:id` - Update lead fields (e.g., advancing stage).
- **DELETE** `/leads/:id` - Remove lead from collection.

### Clients Endpoints (Protected)
- **GET** `/clients` - Retrieve all active clients.
- **POST** `/clients` - Manually onboard a new client.
- **PUT** `/clients/:id` - Edit client info/requirements.
- **DELETE** `/clients/:id` - Remove client profile.

### Performance & Notifications (Protected)
- **GET** `/performance` - Fetch employee rankings and conversion metrics.
- **GET** `/notifications` - Retrieve recent follow-up alerts and notifications.
- **PUT** `/notifications/read-all` - Mark all user notifications as read.
- **PUT** `/notifications/:id/read` - Mark a single notification as read.

---

## 💻 Tech Stack Highlights

- **React.js & Tailwind CSS:** Responsive layouts, modern typography, grid alignment, custom SVG graphs, and smooth CSS keyframe animations.
- **Node.js & Express:** Clean middleware chain, role separation, and error handler blocks.
- **MongoDB & Mongoose:** Fully validated relational mappings, automatic timestamps, indexing, and seed data hooks.
- **JWT & bcrypt:** Industry-standard secure session hashes and token validations.

---

## 📦 Deployment Guide

### Deploying the Backend
1. Provision a MongoDB cloud instance at **MongoDB Atlas**.
2. Deploy the `/server` folder to a hosting service (e.g., Render, Heroku, or AWS Elastic Beanstalk).
3. Set your production environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`) on the hosting provider's panel.

### Deploying the Frontend
1. Re-configure `client/src/services/api.js` to point to the live backend server URL:
   ```javascript
   const api = axios.create({
     baseURL: 'https://your-backend-server.com/api',
   });
   ```
2. Build the production package in the `/client` directory:
   ```bash
   npm run build
   ```
3. Deploy the resulting `/client/dist` directory to a static site host (e.g., Netlify, Vercel, or AWS S3).
