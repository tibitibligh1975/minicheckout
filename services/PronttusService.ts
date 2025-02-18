import { Seller } from '@/models/Seller';
import { Transaction } from '@/models/Transaction';

export class PronttusService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    const apiKey = process.env.PRONTTUS_API_KEY;
    if (!apiKey) throw new Error('PRONTTUS_API_KEY is not defined');
    
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.pronttus.com.br';
  }

  async createTransaction(sellerId: string, data: any) {
    // Busca informações do seller
    const seller = await Seller.findById(sellerId);
    if (!seller) throw new Error('Seller not found');

    // Cria transação na Pronttus
    const response = await fetch(`${this.baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...data,
        merchantId: seller.merchantId,
        splitRules: seller.splitRules,
        metadata: {
          sellerId: seller._id.toString()
        }
      })
    });

    const result = await response.json();

    // Salva a transação no nosso banco
    await Transaction.create({
      sellerId: seller._id,
      pronttusTransactionId: result.id,
      amount: data.amount,
      status: result.status,
      customerInfo: data.customer,
      paymentMethod: data.paymentMethod
    });

    return result;
  }
} 