import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { Transaction } from '@/models/Transaction';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    
    const [totalUsers, totalOrders, totalRevenue] = await Promise.all([
      User.countDocuments({}),
      Transaction.countDocuments({}),
      Transaction.aggregate([
        { $match: { type: 'credit' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      activeUsers: totalUsers // Você pode implementar uma lógica mais específica para usuários ativos
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
} 