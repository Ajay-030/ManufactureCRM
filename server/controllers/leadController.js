import Lead from '../models/Lead.js';
import Client from '../models/Client.js';
import Performance from '../models/Performance.js';
import Notification from '../models/Notification.js';
import mockStore from '../config/mockStore.js';

// Recalculate Performance Metrics for an Employee
const updateEmployeePerformance = async (employeeId, employeeName) => {
  try {
    if (global.useMockDb) {
      const totalLeads = mockStore.leads.filter(l => l.assignedEmployee.toString() === employeeId.toString()).length;
      const closedDeals = mockStore.leads.filter(l => l.assignedEmployee.toString() === employeeId.toString() && l.leadStatus === 'Closed').length;
      const percentage = totalLeads > 0 ? Math.round((closedDeals / totalLeads) * 100) : 0;

      const perfIndex = mockStore.performances.findIndex(p => p.employee.toString() === employeeId.toString());
      if (perfIndex !== -1) {
        mockStore.performances[perfIndex] = {
          ...mockStore.performances[perfIndex],
          employeeName,
          assignedLeads: totalLeads,
          closedDeals,
          performancePercentage: percentage,
          updatedAt: new Date().toISOString()
        };
      } else {
        mockStore.performances.push({
          _id: 'mock_perf_' + employeeId,
          employee: employeeId,
          employeeName,
          assignedLeads: totalLeads,
          closedDeals,
          performancePercentage: percentage,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      return;
    }

    const totalLeads = await Lead.countDocuments({ assignedEmployee: employeeId });
    const closedDeals = await Lead.countDocuments({ assignedEmployee: employeeId, leadStatus: 'Closed' });
    const percentage = totalLeads > 0 ? Math.round((closedDeals / totalLeads) * 100) : 0;

    await Performance.findOneAndUpdate(
      { employee: employeeId },
      {
        employeeName,
        assignedLeads: totalLeads,
        closedDeals,
        performancePercentage: percentage,
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error updating performance:', error);
  }
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req, res) => {
  try {
    // Mock Mode Check
    if (global.useMockDb) {
      let filtered = [...mockStore.leads];
      
      // BDA can only see their own leads
      if (req.user.role === 'BDA') {
        filtered = filtered.filter(l => l.assignedEmployee.toString() === req.user._id.toString());
      }

      if (req.query.search) {
        const queryStr = req.query.search.toLowerCase();
        filtered = filtered.filter(l => 
          l.companyName.toLowerCase().includes(queryStr) ||
          l.clientName.toLowerCase().includes(queryStr) ||
          l.email.toLowerCase().includes(queryStr)
        );
      }

      // Sort by newest
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
        { clientName: searchRegex },
        { email: searchRegex },
      ];
    }

    const leads = await Lead.find(query).sort({ updatedAt: -1 });
    res.json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ success: false, message: 'Server error fetching leads' });
  }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req, res) => {
  const { companyName, clientName, phone, email, notes, value } = req.body;

  try {
    if (!companyName || !clientName || !phone || !email) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }

    const assignedEmployee = req.user._id;
    const assignedEmployeeName = req.user.fullName;

    // Mock Mode Check
    if (global.useMockDb) {
      const newLead = {
        _id: 'mock_lead_' + Date.now(),
        companyName,
        clientName,
        phone,
        email,
        notes: notes || '',
        value: value || 0,
        assignedEmployee,
        assignedEmployeeName,
        leadStatus: 'New Lead',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockStore.leads.push(newLead);

      // Create Notification
      mockStore.notifications.push({
        _id: 'mock_notif_' + Date.now(),
        message: `New lead added for ${companyName} (${clientName})`,
        type: 'System Alert',
        read: false,
        recipient: assignedEmployee,
        createdAt: new Date().toISOString()
      });

      // Update metrics
      await updateEmployeePerformance(assignedEmployee, assignedEmployeeName);

      return res.status(201).json({ success: true, data: newLead });
    }

    const lead = await Lead.create({
      companyName,
      clientName,
      phone,
      email,
      notes: notes || '',
      value: value || 0,
      assignedEmployee,
      assignedEmployeeName,
      leadStatus: 'New Lead',
    });

    // Create a Notification
    await Notification.create({
      message: `New lead added for ${companyName} (${clientName})`,
      type: 'System Alert',
      recipient: req.user._id,
    });

    // Update performance counts
    await updateEmployeePerformance(assignedEmployee, assignedEmployeeName);

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ success: false, message: 'Server error creating lead' });
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req, res) => {
  const { id } = req.params;
  const { companyName, clientName, phone, email, leadStatus, notes, value } = req.body;

  try {
    // Mock Mode Check
    if (global.useMockDb) {
      const leadIndex = mockStore.leads.findIndex(l => l._id.toString() === id.toString());
      if (leadIndex === -1) {
        return res.status(404).json({ success: false, message: 'Lead not found' });
      }

      const lead = mockStore.leads[leadIndex];

      // Authority Check
      if (req.user.role === 'BDA' && lead.assignedEmployee.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this lead' });
      }

      const previousStatus = lead.leadStatus;

      lead.companyName = companyName || lead.companyName;
      lead.clientName = clientName || lead.clientName;
      lead.phone = phone || lead.phone;
      lead.email = email || lead.email;
      lead.leadStatus = leadStatus || lead.leadStatus;
      lead.notes = notes !== undefined ? notes : lead.notes;
      lead.value = value !== undefined ? value : lead.value;
      lead.updatedAt = new Date().toISOString();

      // Client Conversion hook
      if (previousStatus !== leadStatus) {
        const notifId = 'mock_notif_' + Date.now();
        
        if (leadStatus === 'Closed') {
          const clientExists = mockStore.clients.find(c => c.email.toLowerCase() === lead.email.toLowerCase());
          if (!clientExists) {
            mockStore.clients.push({
              _id: 'mock_client_' + Date.now(),
              companyName: lead.companyName,
              contactPerson: lead.clientName,
              email: lead.email,
              phone: lead.phone,
              address: 'Converted from Lead (Update address manually)',
              requirement: lead.notes || 'Original lead notes: ' + lead.companyName,
              assignedEmployee: lead.assignedEmployee,
              assignedEmployeeName: lead.assignedEmployeeName,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }

          mockStore.notifications.push({
            _id: notifId,
            message: `Deal CLOSED successfully with ${lead.companyName}! Client converted.`,
            type: 'Client Reply Received',
            read: false,
            recipient: lead.assignedEmployee,
            createdAt: new Date().toISOString()
          });
        } else if (leadStatus === 'Proposal Sent') {
          mockStore.notifications.push({
            _id: notifId,
            message: `Proposal submitted for ${lead.companyName}. Pending client review.`,
            type: 'Proposal Reminder',
            read: false,
            recipient: lead.assignedEmployee,
            createdAt: new Date().toISOString()
          });
        } else if (leadStatus === 'Contacted') {
          mockStore.notifications.push({
            _id: notifId,
            message: `Initial contact made with ${lead.clientName} from ${lead.companyName}. Follow-up recommended.`,
            type: 'Followup Pending',
            read: false,
            recipient: lead.assignedEmployee,
            createdAt: new Date().toISOString()
          });
        }
      }

      await updateEmployeePerformance(lead.assignedEmployee, lead.assignedEmployeeName);
      return res.json({ success: true, data: lead });
    }

    let lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Check authority (BDA can only edit their own leads)
    if (req.user.role === 'BDA' && lead.assignedEmployee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this lead' });
    }

    const previousStatus = lead.leadStatus;

    lead.companyName = companyName || lead.companyName;
    lead.clientName = clientName || lead.clientName;
    lead.phone = phone || lead.phone;
    lead.email = email || lead.email;
    lead.leadStatus = leadStatus || lead.leadStatus;
    lead.notes = notes !== undefined ? notes : lead.notes;
    lead.value = value !== undefined ? value : lead.value;

    const updatedLead = await lead.save();

    // Trigger follow-up notification or client conversion on status changes
    if (previousStatus !== leadStatus) {
      if (leadStatus === 'Closed') {
        const clientExists = await Client.findOne({ email: lead.email });
        if (!clientExists) {
          await Client.create({
            companyName: lead.companyName,
            contactPerson: lead.clientName,
            email: lead.email,
            phone: lead.phone,
            address: 'Converted from Lead (Update address manually)',
            requirement: lead.notes || 'Original lead notes: ' + lead.companyName,
            assignedEmployee: lead.assignedEmployee,
            assignedEmployeeName: lead.assignedEmployeeName,
          });
        }

        // Notification for Deal Closed
        await Notification.create({
          message: `Deal CLOSED successfully with ${lead.companyName}! Client converted.`,
          type: 'Client Reply Received',
          recipient: lead.assignedEmployee,
        });
      } else if (leadStatus === 'Proposal Sent') {
        await Notification.create({
          message: `Proposal submitted for ${lead.companyName}. Pending client review.`,
          type: 'Proposal Reminder',
          recipient: lead.assignedEmployee,
        });
      } else if (leadStatus === 'Contacted') {
        await Notification.create({
          message: `Initial contact made with ${lead.clientName} from ${lead.companyName}. Follow-up recommended.`,
          type: 'Followup Pending',
          recipient: lead.assignedEmployee,
        });
      }
    }

    // Refresh metrics
    await updateEmployeePerformance(lead.assignedEmployee, lead.assignedEmployeeName);

    res.json({ success: true, data: updatedLead });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ success: false, message: 'Server error updating lead' });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
export const deleteLead = async (req, res) => {
  const { id } = req.params;

  try {
    // Mock Mode Check
    if (global.useMockDb) {
      const leadIndex = mockStore.leads.findIndex(l => l._id.toString() === id.toString());
      if (leadIndex === -1) {
        return res.status(404).json({ success: false, message: 'Lead not found' });
      }

      const lead = mockStore.leads[leadIndex];

      // Authority Check
      if (req.user.role === 'BDA' && lead.assignedEmployee.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this lead' });
      }

      const assignedEmployee = lead.assignedEmployee;
      const assignedEmployeeName = lead.assignedEmployeeName;

      mockStore.leads.splice(leadIndex, 1);

      await updateEmployeePerformance(assignedEmployee, assignedEmployeeName);
      return res.json({ success: true, message: 'Lead removed successfully' });
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Check authority
    if (req.user.role === 'BDA' && lead.assignedEmployee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this lead' });
    }

    const assignedEmployee = lead.assignedEmployee;
    const assignedEmployeeName = lead.assignedEmployeeName;

    await lead.deleteOne();

    // Recalculate metrics
    await updateEmployeePerformance(assignedEmployee, assignedEmployeeName);

    res.json({ success: true, message: 'Lead removed successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ success: false, message: 'Server error deleting lead' });
  }
};
