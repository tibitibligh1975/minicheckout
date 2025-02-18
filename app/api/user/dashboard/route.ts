import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Transaction } from '@/models/Transaction';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

    // Busca as últimas transações do usuário
    const transactions = await Transaction.find({ 
      userId: session.user.id 
    })
    .sort({ createdAt: -1 })
    .limit(10);

    // Calcula totais
    const stats = await Transaction.aggregate([
      { $match: { userId: session.user.id } },
      { $group: {
        _id: '$status',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }}
    ]);

    return NextResponse.json({
      transactions,
      stats
    });

  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados do dashboard' },
      { status: 500 }
    );
  }
} 