import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Followup Pending', 'Proposal Reminder', 'Client Reply Received', 'System Alert'],
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // if null, it is public/broadcasted to all BDA
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
