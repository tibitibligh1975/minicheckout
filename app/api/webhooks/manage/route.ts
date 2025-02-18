import { NextResponse } from 'next/server';
import { PrimePagService } from '@/services/PrimePagService';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  try {
    await dbConnect();
    const primepagService = new PrimePagService();
    const webhooks = await primepagService.listWebhooks();
    return NextResponse.json(webhooks);
  } catch (error) {
    console.error('Erro ao listar webhooks:', error);
    return NextResponse.json(
      { error: 'Erro ao listar webhooks' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    await dbConnect();
    const primepagService = new PrimePagService();
    const result = await primepagService.registerWebhook();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao registrar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao registrar webhook' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { webhookId } = await request.json();
    await dbConnect();
    const primepagService = new PrimePagService();
    await primepagService.deleteWebhook(webhookId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar webhook' },
      { status: 500 }
    );
  }
} 