'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/format';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      const fetchStats = async () => {
        try {
          const response = await fetch('/api/dashboard/stats');
          if (!response.ok) {
            throw new Error('Failed to fetch stats');
          }
          const data = await response.json();
          setStats(data);
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      };
      fetchStats();
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total de Vendas</h3>
          <p className="text-2xl font-bold">R$ {stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pedidos Totais</h3>
          <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pedidos Pendentes</h3>
          <p className="text-2xl font-bold">{stats?.pendingOrders || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Chave API</h2>
        <p className="text-sm text-gray-600 mb-4">
          Use esta chave para integrar o checkout em seu site
        </p>
        <div className="bg-gray-50 p-4 rounded border">
          <code className="text-sm">sk_test_123456789</code>
        </div>
      </div>
    </div>
  );
} 