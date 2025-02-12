import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { CheckCircle, Copy, Timer } from "lucide-react";

interface PixQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixCode: string;
  expiresIn: number; // tempo em segundos
  status: 'pending' | 'approved' | 'expired';
}

export function PixQRModal({ isOpen, onClose, pixCode, expiresIn, status }: PixQRModalProps) {
  const [timeLeft, setTimeLeft] = useState(expiresIn);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === 'pending' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, status]);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Pagamento PIX</h3>
          
          {status === 'pending' && (
            <>
              <div className="bg-gray-50 p-4 rounded-lg">
                <QRCode value={pixCode} className="mx-auto" />
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm">
                <Timer className="w-4 h-4" />
                <span>
                  Expira em {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, '0')}
                </span>
              </div>

              <Button
                onClick={handleCopyCode}
                variant="outline"
                className="w-full"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? "Código Copiado!" : "Copiar Código PIX"}
              </Button>
            </>
          )}

          {status === 'approved' && (
            <div className="text-green-600 space-y-2">
              <CheckCircle className="w-12 h-12 mx-auto" />
              <p className="font-semibold">Pagamento Aprovado!</p>
            </div>
          )}

          {status === 'expired' && (
            <div className="text-red-600">
              <p>Este código PIX expirou.</p>
              <Button onClick={onClose}>Gerar Novo Código</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 