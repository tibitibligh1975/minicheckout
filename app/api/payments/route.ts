import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PronttusService } from '@/services/PronttusService';
import { Seller } from '@/models/Seller';

const pronttusService = new PronttusService();

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const seller = await Seller.findOne({ userId: session.user.id });
    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    const data = await req.json();
    const transaction = await pronttusService.createTransaction(seller._id, data);

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
} 