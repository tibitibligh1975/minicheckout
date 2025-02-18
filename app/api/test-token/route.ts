import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const publicKey = 'd44e37da-00e0-48a1-afd5-93c8c5f26c72';
    const privateKey = '7b2b1ec6-c5e8-4eab-ba53-45bb919217fc';
    const credentials = Buffer.from(`${publicKey}:${privateKey}`).toString('base64');

    console.log('Credenciais:', credentials);

    const response = await fetch('https://api.primepag.com.br/auth/generate_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: JSON.stringify({
        grant_type: 'client_credentials'
      })
    });

    const text = await response.text();
    console.log('Resposta bruta:', text);

    const data = text ? JSON.parse(text) : {};

    return NextResponse.json({
      success: true,
      credentials,
      responseStatus: response.status,
      responseHeaders: Object.fromEntries(response.headers.entries()),
      data
    });

  } catch (error) {
    console.error('Erro ao gerar token:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
} 