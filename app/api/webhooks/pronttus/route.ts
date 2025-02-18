import { NextResponse } from 'next/server';
import { Transaction } from '@/models/Transaction';
import { Seller } from '@/models/Seller';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Atualiza a transação no nosso banco
    const transaction = await Transaction.findOne({
      pronttusTransactionId: data.id
    });

    if (transaction) {
      transaction.status = data.status;
      transaction.updatedAt = new Date();
      await transaction.save();

      // Notifica o seller (opcional)
      const seller = await Seller.findById(transaction.sellerId);
      if (seller?.webhookUrl) {
        // Envia webhook para o seller
        await fetch(seller.webhookUrl, {
          method: 'POST',
          body: JSON.stringify({
            transactionId: transaction._id,
            status: data.status
          })
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
} 