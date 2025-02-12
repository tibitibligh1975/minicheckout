'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { API_URLS } from "@/config/api";
import QRCode from "react-qr-code";
import { Copy, Check } from "lucide-react";

interface PixQRModalProps {
  pixCode: string;
  paymentId: string;
}

export default function PixQRModal({ pixCode, paymentId }: PixQRModalProps) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  useEffect(() => {
    const checkPayment = async () => {
      try {
        const response = await fetch(API_URLS.verifyPayment, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId })
        });

        const data = await response.json();
        if (data?.ok) {
          setPaymentStatus('completed');
          window.location.href = '/orders'; // Redireciona para a página de pedidos
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
      }
    };

    const interval = setInterval(checkPayment, 5000); // Verifica a cada 5 segundos
    return () => clearInterval(interval);
  }, [paymentId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pagamento via PIX</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <QRCode value={pixCode} size={256} />
          
          <div className="flex items-center space-x-2 w-full">
            <Input
              readOnly
              value={pixCode}
              className="font-mono text-sm"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {paymentStatus === 'pending' ? (
            <p className="text-yellow-600">Aguardando pagamento...</p>
          ) : (
            <p className="text-green-600">Pagamento confirmado!</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 