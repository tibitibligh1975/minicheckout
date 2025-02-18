import mongoose from 'mongoose';

const SellerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pronttusId: String,           // ID do vendedor na Pronttus
  apiKey: String,               // Chave API individual (opcional)
  merchantId: String,           // ID do estabelecimento na Pronttus
  splitRules: {                 // Regras de split (opcional)
    percentage: Number,
    fixed: Number
  },
  webhookUrl: String,           // URL de webhook individual
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  }
});

export const Seller = mongoose.models.Seller || mongoose.model('Seller', SellerSchema); 