import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  externalId: String,
  amount: Number,
  status: {
    type: String,
    enum: ['pending', 'completed', 'expired'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['pix'],
    default: 'pix'
  },
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

// Índices para melhor performance
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ externalId: 1 });

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema); 