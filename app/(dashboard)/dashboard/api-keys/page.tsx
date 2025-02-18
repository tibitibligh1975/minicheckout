'use client';

import { ApiKeys } from '../components/ApiKeys';

export default function ApiKeysPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Chaves API</h1>
      <p className="text-gray-600 mb-8">
        Use estas chaves para integrar o checkout em seu site
      </p>
      <ApiKeys />
    </div>
  );
} 