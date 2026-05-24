import Client from '../models/Client.js';
import Notification from '../models/Notification.js';
import mockStore from '../config/mockStore.js';

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
export const getClients = async (req, res) => {
  try {
    // Mock Mode Check
    if (global.useMockDb) {
      let filtered = [...mockStore.clients];

      // BDA can only see their own clients
      if (req.user.role === 'BDA') {
        filtered = filtered.filter(c => c.assignedEmployee.toString() === req.user._id.toString());
      }

      if (req.query.search) {
        const queryStr = req.query.search.toLowerCase();
        filtered = filtered.filter(c => 
          c.companyName.toLowerCase().includes(queryStr) ||
          c.contactPerson.toLowerCase().includes(queryStr) ||
          c.email.toLowerCase().includes(queryStr)
        );
      }

      filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    const query = {};
    if (req.user.role === 'BDA') {
      query.assignedEmployee = req.user._id;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { companyName: searchRegex },
        { contactPerson: searchRegex },
        { email: searchRegex },
      ];
    }

    const clients = await Client.find(query).sort({ updatedAt: -1 });
    res.json({ success: true, count: clients.length, data: clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ success: false, message: 'Server error fetching clients' });
  }
};

// @desc    Create a new client manually
// @route   POST /api/clients
// @access  Private
export const createClient = async (req, res) => {
  const { companyName, contactPerson, email, phone, address, requirement } = req.body;

  try {
    if (!companyName || !contactPerson || !email || !phone || !address || !requirement) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Mock Mode Check
    if (global.useMockDb) {
      const clientExists = mockStore.clients.find(c => c.email.toLowerCase() === email.toLowerCase());
      if (clientExists) {
        return res.status(400).json({ success: false, message: 'Client already exists with this email' });
      }

      const newClient = {
        _id: 'mock_client_' + Date.now(),
        companyName,
        contactPerson,
        email,
        phone,
        address,
        requirement,
        assignedEmployee: req.user._id,
        assignedEmployeeName: req.user.fullName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockStore.clients.push(newClient);

      mockStore.notifications.push({
        _id: 'mock_notif_' + Date.now(),
        message: `Manual Client onboarding: ${companyName} has been registered!`,
        type: 'System Alert',
        read: false,
        recipient: req.user._id,
        createdAt: new Date().toISOString()
      });

      return res.status(201).json({ success: true, data: newClient });
    }

    const clientExists = await Client.findOne({ email });
    if (clientExists) {
      return res.status(400).json({ success: false, message: 'Client already exists with this email' });
    }

    const client = await Client.create({
      companyName,
      contactPerson,
      email,
      phone,
      address,
      requirement,
      assignedEmployee: req.user._id,
      assignedEmployeeName: req.user.fullName,
    });

    // Alert system
    await Notification.create({
      message: `Manual Client onboarding: ${companyName} has been registered!`,
      type: 'System Alert',
      recipient: req.user._id,
    });

    res.status(201).json({ success: true, data: client });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ success: false, message: 'Server error creating client' });
  }
};

// @desc    Update a client
// @route   PUT /api/clients/:id
// @access  Private
export const updateClient = async (req, res) => {
  const { id } = req.params;
  const { companyName, contactPerson, email, phone, address, requirement } = req.body;

  try {
    // Mock Mode Check
    if (global.useMockDb) {
      const clientIndex = mockStore.clients.findIndex(c => c._id.toString() === id.toString());
      if (clientIndex === -1) {
        return res.status(404).json({ success: false, message: 'Client not found' });
      }

      const client = mockStore.clients[clientIndex];

      // Authority Check
      if (req.user.role === 'BDA' && client.assignedEmployee.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this client' });
      }

      client.companyName = companyName || client.companyName;
      client.contactPerson = contactPerson || client.contactPerson;
      client.email = email || client.email;
      client.phone = phone || client.phone;
      client.address = address || client.address;
      client.requirement = requirement || client.requirement;
      client.updatedAt = new Date().toISOString();

      return res.json({ success: true, data: client });
    }

    let client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    // Role verification
    if (req.user.role === 'BDA' && client.assignedEmployee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this client' });
    }

    client.companyName = companyName || client.companyName;
    client.contactPerson = contactPerson || client.contactPerson;
    client.email = email || client.email;
    client.phone = phone || client.phone;
    client.address = address || client.address;
    client.requirement = requirement || client.requirement;

    const updatedClient = await client.save();
    res.json({ success: true, data: updatedClient });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ success: false, message: 'Server error updating client' });
  }
};

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private
export const deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    // Mock Mode Check
    if (global.useMockDb) {
      const clientIndex = mockStore.clients.findIndex(c => c._id.toString() === id.toString());
      if (clientIndex === -1) {
        return res.status(404).json({ success: false, message: 'Client not found' });
      }

      const client = mockStore.clients[clientIndex];

      // Authority Check
      if (req.user.role === 'BDA' && client.assignedEmployee.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this client' });
      }

      mockStore.clients.splice(clientIndex, 1);
      return res.json({ success: true, message: 'Client deleted successfully' });
    }

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    // Role verification
    if (req.user.role === 'BDA' && client.assignedEmployee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this client' });
    }

    await client.deleteOne();
    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ success: false, message: 'Server error deleting client' });
  }
};
