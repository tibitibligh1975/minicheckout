import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  password: String, // Lembre-se de hashear a senha antes de salvar
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  balance: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema); 