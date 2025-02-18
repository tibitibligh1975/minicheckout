'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/format';

interface Sale {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  externalId: string;
  paymentMethod: string;
}

export default function SalesPage() {
  const { data: session } = useSession();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch('/api/user/transactions');
        const data = await response.json();
        setSales(data.transactions);
      } catch (error) {
        console.error('Erro ao carregar vendas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Vendas</h1>
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Vendas</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Valor</th>
                <th className="text-left py-3 px-4">Método</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Data</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id} className="border-b">
                  <td className="py-3 px-4">
                    <code className="bg-gray-50 px-2 py-1 rounded text-sm">
                      {sale.externalId}
                    </code>
                  </td>
                  <td className="py-3 px-4">{formatCurrency(sale.amount)}</td>
                  <td className="py-3 px-4 capitalize">{sale.paymentMethod}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      sale.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : sale.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {sale.status === 'completed' ? 'Pago' : 
                       sale.status === 'pending' ? 'Pendente' : 'Expirado'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(sale.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sales.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma venda encontrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 