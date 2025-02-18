'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface PixResponse {
  qrcode: {
    reference_code: string;
    external_reference: string;
    content: string;
    image_base64: string;
  }
}

export default function TestPix() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PixResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const apiKey = searchParams?.get('apiKey') || '';

  const handleTestPix = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Iniciando requisição para gerar PIX');
      const response = await fetch(`/api/test-primepag?apiKey=${apiKey}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar PIX');
      }

      const data = await response.json();
      console.log('Resposta recebida:', data);
      
      setResult(data);
    } catch (err) {
      console.error('Erro completo:', err);
      setError(err instanceof Error ? err.message : 'Erro ao gerar PIX');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPix = async () => {
    if (result?.qrcode.content) {
      await navigator.clipboard.writeText(result.qrcode.content);
      alert('Código PIX copiado!');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Teste de Geração PIX</h1>
      
      <button
        onClick={handleTestPix}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-600"
      >
        {loading ? 'Gerando...' : 'Gerar PIX de Teste'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <img
                src={`data:image/png;base64,${result.qrcode.image_base64}`}
                alt="QR Code PIX"
                className="w-64 h-64"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código PIX
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={result.qrcode.content}
                  className="flex-1 p-2 border rounded bg-gray-50"
                />
                <button
                  onClick={handleCopyPix}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Copiar
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>Referência: {result.qrcode.reference_code}</p>
              <p>Descrição: {result.qrcode.external_reference}</p>
              <p>Expira em: 30 minutos</p>
            </div>
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-500">
              Dados completos
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
} 