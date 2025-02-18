import mongoose from 'mongoose';

const webhookLogSchema = new mongoose.Schema({
  event: String,
  payload: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  status: String,
  referenceCode: String
});

export const WebhookLog = mongoose.models.WebhookLog || mongoose.model('WebhookLog', webhookLogSchema); 