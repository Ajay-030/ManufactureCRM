import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  assignedLeads: {
    type: Number,
    default: 0,
  },
  closedDeals: {
    type: Number,
    default: 0,
  },
  performancePercentage: {
    type: Number,
    default: 0, // calculated as (closedDeals / assignedLeads) * 100 if assignedLeads > 0
  }
}, {
  timestamps: true
});

const Performance = mongoose.model('Performance', performanceSchema);
export default Performance;
