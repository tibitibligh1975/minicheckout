import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET() {
  try {
    await dbConnect();
    console.log('Conectado ao MongoDB, buscando ordens...');
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Erro ao buscar ordens:', error);
    return NextResponse.json(
      { error: 'Falha ao carregar pedidos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const orderData = await request.json();
    console.log('Criando ordem:', orderData);
    const order = await Order.create(orderData);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Erro ao criar ordem:', error);
    return NextResponse.json(
      { error: 'Falha ao criar pedido' },
      { status: 500 }
    );
  }
} 