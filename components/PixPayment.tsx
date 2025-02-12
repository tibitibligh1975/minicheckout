import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

interface PixPaymentProps {
  pixCode: string;
  loading: boolean;
}

export function PixPayment({ pixCode, loading }: PixPaymentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-center space-y-4">
      {pixCode && (
        <>
          <div className="bg-gray-50 p-4 rounded-lg">
            <QRCode value={pixCode} className="mx-auto" />
          </div>

          <Button
            onClick={handleCopyCode}
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Código Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Código PIX
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
} 