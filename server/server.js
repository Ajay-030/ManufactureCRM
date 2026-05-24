import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Models for seeding
import User from './models/User.js';
import Lead from './models/Lead.js';
import Client from './models/Client.js';
import Performance from './models/Performance.js';
import Notification from './models/Notification.js';

// Load config
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/notifications', notificationRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'ManufactureCRM API is running smoothly' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Seeding function
const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial demo data...');

      // 1. Create a Default BDA and a Manager
      const defaultBDA = await User.create({
        fullName: 'Rajesh Kumar',
        email: 'rajesh@manufacture.com',
        password: 'password123', // will be hashed automatically by pre-save hook
        role: 'BDA'
      });

      const defaultManager = await User.create({
        fullName: 'Amit Sharma',
        email: 'amit@manufacture.com',
        password: 'password123',
        role: 'Manager'
      });

      console.log('Created Rajesh (BDA) and Amit (Manager). Default login password: password123');

      // 2. Create Sample Leads
      const leadsData = [
        {
          companyName: 'Apex Steel Industries',
          clientName: 'Vijay Mallaya',
          phone: '+91 98765 43210',
          email: 'vijay@apexsteel.com',
          assignedEmployee: defaultBDA._id,
          assignedEmployeeName: defaultBDA.fullName,
          leadStatus: 'New Lead',
          value: 450000,
          notes: 'Looking for bulk reinforcement bars (Rebars) grade FE550 for a multi-story warehouse project.'
        },
        {
          companyName: 'Tata Auto Components',
          clientName: 'Sanjay Dutt',
          phone: '+91 91234 56789',
          email: 'sanjay@tata-auto.com',
          assignedEmployee: defaultBDA._id,
          assignedEmployeeName: defaultBDA.fullName,
          leadStatus: 'Contacted',
          value: 1200000,
          notes: 'Enquired about casting and forging parts. Initial call done, scheduling virtual meeting next Tuesday.'
        },
        {
          companyName: 'Mahindra Logistics Supply',
          clientName: 'Nisha Patil',
          phone: '+91 88888 77777',
          email: 'nisha@mahindra-logistics.com',
          assignedEmployee: defaultBDA._id,
          assignedEmployeeName: defaultBDA.fullName,
          leadStatus: 'Proposal Sent',
          value: 850000,
          notes: 'Submitted proposal for custom warehouse shelving units. Awaiting approval on raw material specs.'
        },
        {
          companyName: 'Dynamic Machineries',
          clientName: 'Kunal Kapoor',
          phone: '+91 77777 66666',
          email: 'kunal@dynamicmach.com',
          assignedEmployee: defaultBDA._id,
          assignedEmployeeName: defaultBDA.fullName,
          leadStatus: 'Negotiation',
          value: 2300000,
          notes: 'Contract details being refined. Client wants a 5% volume discount on custom hydraulic cylinder batches.'
        },
        {
          companyName: 'Global Heavy Castings',
          clientName: 'Priya Sharma',
          phone: '+91 99999 88888',
          email: 'priya@globalcastings.com',
          assignedEmployee: defaultBDA._id,
          assignedEmployeeName: defaultBDA.fullName,
          leadStatus: 'Closed',
          value: 3500000,
          notes: 'Deal Closed. Signed contract received for 500 tons of grade 30 grey iron castings.'
        }
      ];

      const leads = await Lead.insertMany(leadsData);
      console.log(`Seeded ${leads.length} initial business leads`);

      // 3. Create Sample Converted Client (matching Closed lead)
      await Client.create({
        companyName: 'Global Heavy Castings',
        contactPerson: 'Priya Sharma',
        email: 'priya@globalcastings.com',
        phone: '+91 99999 88888',
        address: 'Sector 4, Industrial Area, Pune, Maharashtra - 411018',
        requirement: '500 tons of grade 30 grey iron castings (delivered in monthly batches of 50 tons).',
        assignedEmployee: defaultBDA._id,
        assignedEmployeeName: defaultBDA.fullName,
      });
      console.log('Seeded active Client Global Heavy Castings');

      // 4. Create Performance Record for Rajesh
      await Performance.create({
        employee: defaultBDA._id,
        employeeName: defaultBDA.fullName,
        assignedLeads: 5,
        closedDeals: 1,
        performancePercentage: 20
      });

      // 5. Create Sample Notifications
      const notificationsData = [
        {
          message: 'Followup Pending: Call Vijay Mallaya from Apex Steel regarding material specifications.',
          type: 'Followup Pending',
          recipient: defaultBDA._id,
        },
        {
          message: 'Proposal Reminder: Review Mahindra Logistics proposal pricing model before the weekend.',
          type: 'Proposal Reminder',
          recipient: defaultBDA._id,
        },
        {
          message: 'Client Reply Received: Priya Sharma signed and returned the Global Heavy Castings contract!',
          type: 'Client Reply Received',
          recipient: defaultBDA._id,
        }
      ];

      await Notification.insertMany(notificationsData);
      console.log('Seeded sample team notifications successfully.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to DB
  await connectDB();
  
  // Seed Database
  await seedDatabase();

  // Listen
  app.listen(PORT, () => {
    console.log(`\x1b[36m[Server] ManufactureCRM backend listening on port ${PORT}\x1b[0m`);
  });
};

startServer();
