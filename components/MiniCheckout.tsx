'use client';

import { useState } from "react";
import { API_URLS } from "@/config/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import PixQRModal from "./PixQRModal";
import type { FormData } from '@/types';
import { DialogContent } from "@/components/ui/dialog";

interface PaymentResponse {
  paymentId: string;
  pixCode: string;
}

export default function MiniCheckout() {
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<PaymentResponse | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    cpf: "",
    phone: "",
  });

  const generatePixCode = async () => {
    setLoading(true);
    try {
      const pixPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ''),
        cpf: formData.cpf.replace(/\D/g, ''),
        offerId: "3f45b855-f0a4-44c8-b343-6ab64a71e69c"
      };

      const pixResponse = await fetch(API_URLS.generatePix, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(pixPayload)
      });

      if (!pixResponse.ok) {
        const errorText = await pixResponse.text();
        console.error('Erro da API:', errorText);
        throw new Error(`Falha ao gerar PIX: ${errorText}`);
      }

      const pixData = await pixResponse.json();
      console.log('PIX gerado:', pixData);

      // Salva o pedido
      console.log('Tentando salvar pedido...');
      const orderResponse = await fetch(API_URLS.orders, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          amount: 17.00,
          pixCode: pixData.pixCode,
          paymentId: pixData.paymentId,
          status: 'pending',
          createdAt: new Date().toISOString()
        })
      });

      console.log('Resposta do salvamento:', await orderResponse.text());

      if (!orderResponse.ok) throw new Error('Falha ao salvar pedido');
      
      setPixData(pixData);
    } catch (error) {
      console.error('Erro completo:', error);
      alert('Erro ao gerar o PIX. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">Checkout</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Seu nome completo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="seu@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleInputChange}
            placeholder="000.000.000-00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="(00) 00000-0000"
          />
        </div>

        <Button 
          className="w-full" 
          onClick={generatePixCode}
          disabled={loading}
        >
          {loading ? "Gerando PIX..." : "Gerar PIX"}
        </Button>

        {pixData && (
          <PixQRModal
            pixCode={pixData.pixCode}
            paymentId={pixData.paymentId}
          />
        )}
      </div>
    </div>
  );
}
