// In-Memory Mock Database Store for ManufactureCRM
// Allows the application to run flawlessly without requiring a local MongoDB instance.

import bcrypt from 'bcryptjs';

const mockStore = {
  users: [
    {
      _id: 'mock_user_rajesh',
      fullName: 'Rajesh Kumar',
      email: 'rajesh@manufacture.com',
      password: '', // Will hold a hashed version on init
      role: 'BDA',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'mock_user_amit',
      fullName: 'Amit Sharma',
      email: 'amit@manufacture.com',
      password: '', // Will hold a hashed version on init
      role: 'Manager',
      createdAt: new Date().toISOString(),
    }
  ],

  leads: [
    {
      _id: 'mock_lead_1',
      companyName: 'Apex Steel Industries',
      clientName: 'Vijay Mallaya',
      phone: '+91 98765 43210',
      email: 'vijay@apexsteel.com',
      assignedEmployee: 'mock_user_rajesh',
      assignedEmployeeName: 'Rajesh Kumar',
      leadStatus: 'New Lead',
      value: 450000,
      notes: 'Looking for bulk reinforcement bars (Rebars) grade FE550 for a warehouse project.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'mock_lead_2',
      companyName: 'Tata Auto Components',
      clientName: 'Sanjay Dutt',
      phone: '+91 91234 56789',
      email: 'sanjay@tata-auto.com',
      assignedEmployee: 'mock_user_rajesh',
      assignedEmployeeName: 'Rajesh Kumar',
      leadStatus: 'Contacted',
      value: 1200000,
      notes: 'Enquired about casting and forging parts. Initial call done.',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'mock_lead_3',
      companyName: 'Mahindra Logistics Supply',
      clientName: 'Nisha Patil',
      phone: '+91 88888 77777',
      email: 'nisha@mahindra-logistics.com',
      assignedEmployee: 'mock_user_rajesh',
      assignedEmployeeName: 'Rajesh Kumar',
      leadStatus: 'Proposal Sent',
      value: 850000,
      notes: 'Submitted proposal for custom warehouse shelving units.',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'mock_lead_4',
      companyName: 'Dynamic Machineries',
      clientName: 'Kunal Kapoor',
      phone: '+91 77777 66666',
      email: 'kunal@dynamicmach.com',
      assignedEmployee: 'mock_user_rajesh',
      assignedEmployeeName: 'Rajesh Kumar',
      leadStatus: 'Negotiation',
      value: 2300000,
      notes: 'Contract details being refined. Client wants a 5% volume discount.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'mock_lead_5',
      companyName: 'Global Heavy Castings',
      clientName: 'Priya Sharma',
      phone: '+91 99999 88888',
      email: 'priya@globalcastings.com',
      assignedEmployee: 'mock_user_rajesh',
      assignedEmployeeName: 'Rajesh Kumar',
      leadStatus: 'Closed',
      value: 3500000,
      notes: 'Deal Closed. Signed contract received for grey iron castings.',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    }
  ],

  clients: [
    {
      _id: 'mock_client_1',
      companyName: 'Global Heavy Castings',
      contactPerson: 'Priya Sharma',
      email: 'priya@globalcastings.com',
      phone: '+91 99999 88888',
      address: 'Sector 4, Industrial Area, Pune, Maharashtra - 411018',
      requirement: '500 tons of grade 30 grey iron castings (delivered in monthly batches of 50 tons).',
      assignedEmployee: 'mock_user_rajesh',
      assignedEmployeeName: 'Rajesh Kumar',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    }
  ],

  performances: [
    {
      _id: 'mock_perf_rajesh',
      employee: 'mock_user_rajesh',
      employeeName: 'Rajesh Kumar',
      assignedLeads: 5,
      closedDeals: 1,
      performancePercentage: 20,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],

  notifications: [
    {
      _id: 'mock_notif_1',
      message: 'Followup Pending: Call Vijay Mallaya from Apex Steel regarding material specifications.',
      type: 'Followup Pending',
      read: false,
      recipient: 'mock_user_rajesh',
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'mock_notif_2',
      message: 'Proposal Reminder: Review Mahindra Logistics proposal pricing model before the weekend.',
      type: 'Proposal Reminder',
      read: false,
      recipient: 'mock_user_rajesh',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'mock_notif_3',
      message: 'Client Reply Received: Priya Sharma signed and returned the Global Heavy Castings contract!',
      type: 'Client Reply Received',
      read: false,
      recipient: 'mock_user_rajesh',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    }
  ]
};

// Initialize Mock Hashed Passwords
const initMockPasswords = async () => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('password123', salt);
  mockStore.users.forEach(u => {
    u.password = hash;
  });
  console.log('\x1b[35m[Mock DB Store] Hashed mock user credentials successfully.\x1b[0m');
};

initMockPasswords();

export default mockStore;
export { mockStore };
