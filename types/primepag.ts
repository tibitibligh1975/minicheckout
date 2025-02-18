export interface PrimePagWebhookPayload {
  notification_type: string;
  message: {
    value_cents: number;
    reference_code: string;
    external_reference?: string;
    content: string;
    status: 'pending' | 'paid' | 'expired';
    generator_name?: string;
    generator_document?: string;
    payer_name?: string;
    payer_document?: string;
    registration_date?: string;
    payment_date?: string;
    end_to_end?: string;
  };
  data: {
    reference_code: string;
    status: string;
    value_cents: number;
    payment_date?: string;
  };
}

export interface WebhookLog {
  id: string;
  event: string;
  payload: PrimePagWebhookPayload;
  error?: string;
  processedAt: Date;
  createdAt: Date;
} 