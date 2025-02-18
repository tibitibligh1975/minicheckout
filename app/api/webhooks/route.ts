import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { WebhookLog } from '@/models/WebhookLog';
import { Transaction } from '@/models/Transaction';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const payload = await request.json();

    // Salva o log do webhook
    await WebhookLog.create({
      event: payload.event,
      payload
    });

    // Atualiza a transação se necessário
    if (payload.event === 'payment.confirmed') {
      await Transaction.findOneAndUpdate(
        { externalId: payload.reference_code },
        { status: 'completed' }
      );
    } else if (payload.event === 'payment.expired') {
      await Transaction.findOneAndUpdate(
        { externalId: payload.reference_code },
        { status: 'expired' }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
} 