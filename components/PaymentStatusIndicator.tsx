import { CheckCircle, Clock, XCircle } from "lucide-react";
import { PaymentStatus } from "@/types/payment";

interface PaymentStatusIndicatorProps {
  status: PaymentStatus;
}

export function PaymentStatusIndicator({ status }: PaymentStatusIndicatorProps) {
  switch (status) {
    case "approved":
      return (
        <div className="flex items-center justify-center space-x-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span>Pagamento Aprovado</span>
        </div>
      );
    case "pending":
      return (
        <div className="flex items-center justify-center space-x-2 text-yellow-600">
          <Clock className="w-5 h-5" />
          <span>Aguardando Pagamento</span>
        </div>
      );
    case "expired":
      return (
        <div className="flex items-center justify-center space-x-2 text-red-600">
          <XCircle className="w-5 h-5" />
          <span>Pagamento Expirado</span>
        </div>
      );
    case "error":
      return (
        <div className="flex items-center justify-center space-x-2 text-red-600">
          <XCircle className="w-5 h-5" />
          <span>Erro no Pagamento</span>
        </div>
      );
    default:
      return null;
  }
} 