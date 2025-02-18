import { PrimePagWebhookPayload } from '@/types/primepag';
import { Transaction } from '@/models/Transaction';

export class WebhookService {
  async handlePaymentCreated(data: PrimePagWebhookPayload['data']) {
    console.log('Processando payment.created:', data);

    await Transaction.findOneAndUpdate(
      { externalId: data.reference_code },
      {
        $set: {
          externalId: data.reference_code,
          status: 'pending',
          amount: data.value_cents,
          paymentMethod: 'pix',
          metadata: data
        }
      },
      { upsert: true, new: true }
    );
  }

  async handlePaymentConfirmed(data: PrimePagWebhookPayload['data']) {
    console.log('Processando payment.confirmed:', data);

    await Transaction.findOneAndUpdate(
      { externalId: data.reference_code },
      {
        $set: {
          status: 'paid',
          paidAt: new Date(),
          metadata: data
        }
      }
    );
  }

  async handlePaymentExpired(data: PrimePagWebhookPayload['data']) {
    console.log('Processando payment.expired:', data);

    await Transaction.findOneAndUpdate(
      { externalId: data.reference_code },
      {
        $set: {
          status: 'expired'
        }
      }
    );
  }

  async processWebhook(payload: any) {
    try {
      console.log('Processando webhook:', payload);

      // Determinar o evento com base no status
      let event = 'payment.created';
      
      if (payload.message?.status === 'paid') {
        event = 'payment.confirmed';
        
        // Verificar se a transação existe
        const transaction = await Transaction.findOne({
          externalId: payload.message.reference_code
        });

        if (transaction) {
          // Atualizar apenas se a transação existir
          await Transaction.findOneAndUpdate(
            { externalId: payload.message.reference_code },
            {
              $set: {
                status: 'paid',
                paidAt: payload.message.payment_date ? new Date(payload.message.payment_date) : new Date()
              }
            }
          );
        } else {
          console.log('Transação não encontrada:', payload.message.reference_code);
        }
      } else if (payload.message?.status === 'expired') {
        event = 'payment.expired';
        
        // Verificar se a transação existe
        const transaction = await Transaction.findOne({
          externalId: payload.message.reference_code
        });

        if (transaction) {
          // Atualizar apenas se a transação existir
          await Transaction.findOneAndUpdate(
            { externalId: payload.message.reference_code },
            {
              $set: {
                status: 'expired'
              }
            }
          );
        } else {
          console.log('Transação não encontrada:', payload.message.reference_code);
        }
      }

      // Registrar o log do webhook independentemente da transação existir
      const log = await Transaction.create({
        externalId: payload.message.reference_code,
        status: event,
        payload,
        processedAt: new Date()
      });

      console.log('Log criado:', log);
      return log;

    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      throw error;
    }
  }
} 