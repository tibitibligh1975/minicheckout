import { Dialog, DialogContent } from "./ui/dialog";
import QRCode from "react-qr-code";
import { PaymentStatus } from "@/types/payment";
import { PaymentStatusIndicator } from "./PaymentStatusIndicator";
import { useEffect, useState } from "react";

interface PixQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixCode: string;
  expiresIn: number;
  status: PaymentStatus;
}

export function PixQRModal({ isOpen, onClose, pixCode, expiresIn, status }: PixQRModalProps) {
  const [timeLeft, setTimeLeft] = useState(expiresIn);

  useEffect(() => {
    if (!isOpen || status !== 'pending') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, status]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium">Pagamento via PIX</h3>
          
          {status === 'pending' && (
            <>
              <div className="bg-gray-50 p-4 rounded-lg">
                <QRCode value={pixCode} className="mx-auto" />
              </div>
              
              <div className="text-sm text-gray-500">
                Tempo restante: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
            </>
          )}

          <PaymentStatusIndicator status={status} />
        </div>
      </DialogContent>
    </Dialog>
  );
} 