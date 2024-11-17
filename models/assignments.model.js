const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  task: {
    type: String,
    required: [true, 'Please add task details']
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
},
{
  timestamps: { createdAt: 'submissionDate', updatedAt: true }
});

module.exports = mongoose.model('Assignment', assignmentSchema);