import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import { ApiKey } from '@/models/ApiKey';
import crypto from 'crypto';

// Gerar chaves API
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Gera uma chave API única
    const apiKey = crypto.randomBytes(16).toString('hex');
    
    const newApiKey = await ApiKey.create({
      userId: session.user.id,
      key: apiKey,
      isActive: true
    });

    return NextResponse.json({ apiKey: newApiKey });
  } catch (error) {
    console.error('Erro ao gerar API Key:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar API Key' },
      { status: 500 }
    );
  }
}

// Listar chaves API do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const apiKeys = await ApiKey.find({ 
      userId: session.user.id 
    });

    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error('Erro ao listar API Keys:', error);
    return NextResponse.json(
      { error: 'Erro ao listar API Keys' },
      { status: 500 }
    );
  }
} 