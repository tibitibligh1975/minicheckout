'use client';

import { useState } from "react";
import { API_URLS } from "@/config/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import PixQRModal from "./PixQRModal";
import type { FormData } from '@/types';

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
    amount: 0
  });

  const generatePixCode = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URLS.generatePix, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.amount.toString(),
          email: formData.email,
          phone: formData.phone.replace(/\D/g, ''),
          cpf: formData.cpf.replace(/\D/g, ''),
          offerId: "3f45b855-f0a4-44c8-b343-6ab64a71e69c"
        })
      });

      if (!response.ok) throw new Error('Falha ao gerar PIX');

      const data = await response.json();
      setPixData(data);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao gerar o PIX. Tente novamente.');
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

        <div className="space-y-2">
          <Label htmlFor="amount">Valor</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
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
