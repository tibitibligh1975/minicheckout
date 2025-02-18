'use client';

import { useState, useEffect } from 'react';

export function ApiKeys() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Carrega as chaves existentes
  const loadApiKeys = async () => {
    try {
      const response = await fetch('/api/user/api-keys');
      const data = await response.json();
      if (data.apiKeys) {
        setApiKeys(data.apiKeys);
      }
    } catch (error) {
      console.error('Erro ao carregar chaves:', error);
    }
  };

  // Carrega as chaves quando o componente montar
  useEffect(() => {
    loadApiKeys();
  }, []);

  const generateApiKey = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/api-keys', {
        method: 'POST'
      });
      const data = await response.json();
      
      // Recarrega as chaves após gerar uma nova
      await loadApiKeys();
    } catch (error) {
      console.error('Erro ao gerar chave:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 text-sm font-medium text-gray-500">Nome</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Chave</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Criada em</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Último uso</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {apiKeys.map((apiKey) => (
              <tr key={apiKey._id}>
                <td className="p-4">Chave Principal</td>
                <td className="p-4">
                  <code className="bg-gray-50 px-2 py-1 rounded text-sm">
                    {apiKey.key}
                  </code>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(apiKey.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-sm text-gray-600">Nunca</td>
                <td className="p-4 text-right">
                  <button 
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                    onClick={() => {/* Implementar revogação */}}
                  >
                    Revogar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {apiKeys.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 mb-4">Nenhuma chave API gerada</p>
          <button
            onClick={generateApiKey}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Gerando...' : 'Gerar Nova Chave'}
          </button>
        </div>
      )}

      {apiKeys.length > 0 && (
        <div className="mt-4 text-right">
          <button
            onClick={generateApiKey}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Gerando...' : 'Gerar Nova Chave'}
          </button>
        </div>
      )}
    </div>
  );
} 