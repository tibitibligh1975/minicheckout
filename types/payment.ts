export type PaymentStatus = 'pending' | 'approved' | 'expired' | 'error';

export interface PaymentResponse {
  statusCode: number;
  status: PaymentStatus;
  data?: {
    pixCode?: string;
    transactionId?: string;
  };
  message?: string;
} 