import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await dbConnect();
    
    const [totalOrders, totalRevenue, pendingOrders] = await Promise.all([
      Order.countDocuments({ sellerId: session.user.id }),
      Order.aggregate([
        { $match: { sellerId: session.user.id } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Order.countDocuments({ sellerId: session.user.id, status: 'pending' })
    ]);

    return NextResponse.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
} 