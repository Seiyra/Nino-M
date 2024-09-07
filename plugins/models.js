import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  لقب: {
    type: String,
    default: ''
  },
  groupId: {
    type: String,
    required: true
  }
});

const userMessageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  groupId: {
    type: String,
    required: true
  },
  messageCount: {
    type: Number,
    default: 0
  }
});

// Check if the model is already defined to avoid overwriting
const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);
const UserMessage = mongoose.models.UserMessage || mongoose.model('UserMessage', userMessageSchema);

export { UserProfile, UserMessage };
