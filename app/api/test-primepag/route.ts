import { NextResponse } from 'next/server';
import { PrimePagService } from '@/services/PrimePagService';
import { ApiKey } from '@/models/ApiKey';
import { Transaction } from '@/models/Transaction';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('apiKey');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key não fornecida' },
        { status: 400 }
      );
    }

    const primepagService = new PrimePagService();
    const result = await primepagService.generatePix({
      amount: 300,
      apiKey
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar PIX' },
      { status: 500 }
    );
  }
} 