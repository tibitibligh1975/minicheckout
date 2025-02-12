'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentStatus } from "@/types/payment";
import { validateCPF } from "@/utils/validators";
import { CustomerForm } from "./CustomerForm";
import { PixPayment } from "./PixPayment";
import { PaymentStatusIndicator } from "./PaymentStatusIndicator";
import { PixQRModal } from "./PixQRModal";
import { maskCPF, maskPhone } from "@/utils/masks";
import { toast } from "react-hot-toast";

export interface FormData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  amount: number;
}

// Definir a interface para as props do CustomerForm
interface CustomerFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
}

export default function MiniCheckout() {
  const [paymentMethod, setPaymentMethod] = useState<"pix">("pix");
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    amount: 0
  });
  const [pixCode, setPixCode] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  useEffect(() => {
    if (paymentMethod === "pix") {
      generatePixCode();
    }
  }, [paymentMethod]);

  useEffect(() => {
    if (!transactionId || paymentStatus !== 'pending') return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`https://api.exattus.com/api/checkout/status/${transactionId}`);
        const data = await response.json();
        
        if (data.status === 'approved') {
          setPaymentStatus('approved');
          return true;
        } else if (data.status === 'expired') {
          setPaymentStatus('expired');
          return true;
        }
        return false;
      } catch (error) {
        console.error('Erro ao verificar status:', error);
        return false;
      }
    };

    const pollInterval = setInterval(async () => {
      const shouldStop = await checkStatus();
      if (shouldStop) clearInterval(pollInterval);
    }, 5000); // verifica a cada 5 segundos

    return () => clearInterval(pollInterval);
  }, [transactionId, paymentStatus]);

  const generatePixCode = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.exattus.com/api/checkout/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: formData.amount,
          method: "PIX",
          customer: {
            name: formData.name,
            email: formData.email,
            cpf: formData.cpf.replace(/\D/g, ''),
            phone: formData.phone.replace(/\D/g, ''),
          },
        }),
      });
      
      const data = await response.json();
      if (data.statusCode === 200) {
        setPixCode(data.data.pixCode);
        setTransactionId(data.data.transactionId);
        setPaymentStatus('pending');
        setIsModalOpen(true);
      } else {
        throw new Error(data.message || 'Erro ao gerar PIX');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao gerar código PIX');
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setErrors({});

    // Validate inputs
    const validationErrors: Record<string, string> = {};
    if (!validateCPF(formData.cpf)) {
      validationErrors.cpf = "CPF inválido";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.exattus.com/api/checkout/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: formData.amount,
          method: paymentMethod.toUpperCase(),
          customer: {
            name: formData.name,
            email: formData.email,
            cpf: formData.cpf,
            phone: formData.phone,
          },
        }),
      });

      const data = await response.json();
      setPaymentStatus(data.status as PaymentStatus);
      
      if (data.statusCode === 200) {
        if (paymentMethod === "pix") {
          setPixCode(data.data.pixCode);
        }
      }
    } catch (error) {
      console.error("Erro no pagamento", error);
      setPaymentStatus("error");
    }
    setLoading(false);
  };

  return (
    <Card className="p-4 w-full max-w-md mx-auto shadow-lg">
      <CardContent>
        <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>
        
        <Tabs 
          value={paymentMethod} 
          onValueChange={setPaymentMethod as (value: string) => void}
        >
          <TabsList className="grid w-full grid-cols-1 mb-6">
            <TabsTrigger value="pix">PIX</TabsTrigger>
          </TabsList>

          <CustomerForm 
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />

          <TabsContent value="pix">
            <PixPayment 
              pixCode={pixCode}
              loading={loading}
            />
          </TabsContent>
        </Tabs>

        <PaymentStatusIndicator status={paymentStatus} />

        <Button
          className="w-full mt-6"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">⭮</span>
              Processando...
            </span>
          ) : (
            `Pagar com ${paymentMethod === "pix" ? "PIX" : "Cartão"}`
          )}
        </Button>

        <Button
          className="w-full mt-4"
          onClick={generatePixCode}
          disabled={loading}
        >
          {loading ? "Gerando PIX..." : "Gerar PIX"}
        </Button>

        <PixQRModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          pixCode={pixCode}
          expiresIn={900} // 15 minutos
          status={paymentStatus}
        />
      </CardContent>
    </Card>
  );
}
