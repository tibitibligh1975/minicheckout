import { NextResponse } from 'next/server';
import { PrimePagService } from '@/services/PrimePagService';

const primepagService = new PrimePagService();

export async function POST() {
  try {
    const result = await primepagService.registerWebhook();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Failed to register webhook:', error);
    return NextResponse.json(
      { error: 'Falha ao registrar webhook' },
      { status: 500 }
    );
  }
} 