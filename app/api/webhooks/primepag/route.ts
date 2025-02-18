import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { WebhookService } from '@/services/WebhookService';
import dbConnect from '@/lib/dbConnect';
import { WebhookLog } from '@/models/WebhookLog';
import { Transaction } from '@/models/Transaction';

const webhookService = new WebhookService();

export async function POST(request: Request) {
  try {
    await dbConnect();
    const headersList = headers();
    console.log('Headers recebidos:', Object.fromEntries(headersList.entries()));

    const payload = await request.json();
    console.log('1. Webhook recebido:', payload);

    // Salva o log do webhook
    await WebhookLog.create({
      event: payload.notification_type,
      payload,
      status: payload.message.status,
      referenceCode: payload.message.reference_code
    });

    // Mapeia o status do PrimePag para nosso status interno
    let status;
    if (payload.message.status === 'paid') {
      status = 'completed';
    } else if (payload.message.status === 'expired') {
      status = 'expired';
    } else {
      status = 'pending';
    }

    console.log('2. Atualizando transação:', {
      externalId: payload.message.reference_code,
      novoStatus: status
    });

    // Atualiza a transação
    const transaction = await Transaction.findOneAndUpdate(
      { externalId: payload.message.reference_code },
      { 
        status,
        $set: {
          'metadata.payment_date': payload.message.payment_date,
          'metadata.payer_name': payload.message.payer_name,
          'metadata.end_to_end': payload.message.end_to_end
        }
      },
      { new: true }
    );

    console.log('3. Transação atualizada:', transaction);

    return NextResponse.json({ 
      success: true,
      transaction 
    });
  } catch (error) {
    console.error('Erro completo no webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
} 