import { primepagConfig } from '@/config/primepag';
import { Transaction } from '@/models/Transaction';
import dbConnect from '@/lib/dbConnect';
import { ApiKey } from '@/models/ApiKey';

export class PrimePagService {
  private baseUrl: string;
  private publicKey: string;
  private privateKey: string;
  private token: string | null = null;
  private maxRetries = 3; // Limite de tentativas

  constructor() {
    console.log('Iniciando PrimePagService');
    if (!primepagConfig.publicKey || !primepagConfig.privateKey) {
      console.error('Credenciais:', {
        publicKey: !!primepagConfig.publicKey,
        privateKey: !!primepagConfig.privateKey
      });
      throw new Error('Credenciais do PrimePag não configuradas');
    }
    this.baseUrl = 'https://api.primepag.com.br';
    this.publicKey = process.env.PRIMEPAG_PUBLIC_KEY || '';
    this.privateKey = process.env.PRIMEPAG_PRIVATE_KEY || '';
  }

  async getApiToken() {
    console.log('Iniciando getApiToken...');
    const credentials = Buffer.from(`${this.publicKey}:${this.privateKey}`).toString('base64');
    
    console.log('Fazendo requisição para gerar token...');
    const response = await fetch(`${this.baseUrl}/auth/generate_token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({
        grant_type: 'client_credentials'
      }),
      cache: 'no-store'
    });

    console.log('Status da resposta:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao gerar token:', {
        status: response.status,
        error: errorText
      });
      throw new Error(`Falha ao obter token de API: ${response.status}`);
    }

    const data = await response.json();
    console.log('Token gerado com sucesso:', {
      tokenExists: !!data.access_token,
      tokenLength: data.access_token?.length
    });
    
    this.token = data.access_token;
    return this.token;
  }

  private async request(path: string, options: RequestInit = {}) {
    const apiToken = await this.getApiToken();
    const url = `${this.baseUrl}${path}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Erro na resposta:', error);
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    return response.json();
  }

  async registerWebhook() {
    const webhookUrl = process.env.NEXT_PUBLIC_API_URL 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/webhooks`
      : 'http://localhost:3000/api/webhooks';

    console.log('Registrando webhook na URL:', webhookUrl); // Debug

    return this.request('/v1/webhook', {
      method: 'POST',
      body: JSON.stringify({
        url: webhookUrl,
        description: 'Webhook para notificações de pagamento',
        events: ['payment.created', 'payment.confirmed', 'payment.expired'] // Adicione os eventos que deseja receber
      })
    });
  }

  async listWebhooks() {
    if (!this.token) {
      await this.getApiToken();
    }

    const response = await fetch('https://api.primepag.com.br/v1/webhooks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Erro ao listar webhooks:', error);
      throw new Error(`Erro ao listar webhooks: ${response.status}`);
    }

    return response.json();
  }

  async deleteWebhook(webhookId: string) {
    return this.request(`/v1/webhook/${webhookId}`, {
      method: 'DELETE'
    });
  }

  async generatePix(data: { amount: number, apiKey: string }) {
    try {
      // Busca o usuário pela API Key
      await dbConnect();
      const apiKeyDoc = await ApiKey.findOne({ 
        key: data.apiKey,
        isActive: true 
      });

      if (!apiKeyDoc) {
        throw new Error('API Key inválida');
      }

      // Gera o PIX usando as credenciais do PrimePag
      if (!this.token) {
        await this.getApiToken();
      }

      const response = await fetch(`${this.baseUrl}/v1/pix/qrcodes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value_cents: data.amount,
          generator_name: "Test User",
          generator_document: "43136603800",
          expiration_time: "1800",
          external_reference: `PIX-${apiKeyDoc.userId}`
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const result = await response.json();

      // Salva a transação
      await Transaction.create({
        userId: apiKeyDoc.userId,
        amount: data.amount,
        status: 'pending',
        paymentMethod: 'pix',
        externalId: result.qrcode.reference_code,
        metadata: result
      });

      return result;
    } catch (error) {
      console.error('Erro no PrimePagService:', error);
      throw error;
    }
  }
} 