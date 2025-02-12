import { PaymentStatus } from "@/types/payment";

interface PaymentStatusIndicatorProps {
  status: PaymentStatus;
}

export function PaymentStatusIndicator({ status }: PaymentStatusIndicatorProps) {
  const statusMessages = {
    pending: "Aguardando pagamento",
    approved: "Pagamento aprovado",
    expired: "Pagamento expirado",
    error: "Erro no pagamento",
  };

  const statusColors = {
    pending: "text-yellow-500",
    approved: "text-green-500",
    expired: "text-red-500",
    error: "text-red-500",
  };

  return (
    <div className={`text-center mt-4 font-medium ${statusColors[status]}`}>
      {statusMessages[status]}
    </div>
  );
}