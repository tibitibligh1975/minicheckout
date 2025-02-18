import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrimePagService } from '@/services/PrimePagService';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const primepag = new PrimePagService();

  const result = await primepag.generatePix({
    ...body,
    userId: session.user.id
  });

  return new Response(JSON.stringify(result));
} 