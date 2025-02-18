import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { WebhookLog } from '@/models/WebhookLog';

export async function GET() {
  try {
    await dbConnect();
    const logs = await WebhookLog.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar logs' },
      { status: 500 }
    );
  }
} 