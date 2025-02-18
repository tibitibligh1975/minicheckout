import { NextResponse } from 'next/server';
import { Seller } from '@/models/Seller';
import dbConnect from '@/lib/mongodb';

// Mudando para GET para teste
export async function GET() {
  try {
    await dbConnect();

    // Criar um seller de teste
    const seller = await Seller.create({
      userId: '123', // ID fictício do usuário
      pronttusId: 'test-merchant',
      merchantId: 'test-merchant-id',
      status: 'active',
      splitRules: {
        percentage: 90, // 90% para o seller
        fixed: 0
      }
    });

    return NextResponse.json({
      success: true,
      seller,
      message: 'Use este ID para testar: ' + seller._id
    });

  } catch (error: any) {
    console.error('Create Seller error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 