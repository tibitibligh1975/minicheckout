import { NextResponse } from 'next/server';
import { PronttusService } from '@/services/PronttusService';

const pronttusService = new PronttusService();

export async function GET() {
  try {
    // Dados de teste
    const testData = {
      amount: 1000, // R$ 10,00
      customer: {
        name: "Cliente Teste",
        email: "teste@email.com",
        document: "12345678909"
      },
      paymentMethod: "credit_card",
      card: {
        number: "4111111111111111",
        holder: "Cliente Teste",
        expirationMonth: "12",
        expirationYear: "2025",
        cvv: "123"
      }
    };

    // Criar uma transação de teste
    const transaction = await pronttusService.createTransaction(
      "test-seller-id", // Você precisará criar um seller primeiro
      testData
    );

    return NextResponse.json({
      success: true,
      transaction
    });

  } catch (error: any) {
    console.error('Teste Pronttus error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 