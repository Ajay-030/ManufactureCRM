import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  requirement: {
    type: String,
    required: [true, 'Requirement details are required'],
    trim: true,
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedEmployeeName: {
    type: String,
  }
}, {
  timestamps: true
});

const Client = mongoose.model('Client', clientSchema);
export default Client;
