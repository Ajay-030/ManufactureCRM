import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Assigned employee is required'],
  },
  assignedEmployeeName: {
    type: String,
    required: [true, 'Assigned employee name is required'],
  },
  leadStatus: {
    type: String,
    enum: ['New Lead', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed'],
    default: 'New Lead',
  },
  value: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    default: '',
  }
}, {
  timestamps: true
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
