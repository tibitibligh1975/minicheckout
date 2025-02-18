'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface Transaction {
  _id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  createdAt: string;
}

interface FinanceStats {
  totalRevenue: number;
  availableBalance: number;
  pendingBalance: number;
}

export default function FinancePage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<FinanceStats>({
    totalRevenue: 0,
    availableBalance: 0,
    pendingBalance: 0
  });

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const [transactionsRes, statsRes] = await Promise.all([
          fetch('/api/finance/transactions'),
          fetch('/api/finance/stats')
        ]);
        
        if (transactionsRes.ok && statsRes.ok) {
          const [transactionsData, statsData] = await Promise.all([
            transactionsRes.json(),
            statsRes.json()
          ]);
          
          setTransactions(transactionsData);
          setStats(statsData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados financeiros:', error);
      }
    };

    fetchFinanceData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Financeiro</h1>
      
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Receita Total</h3>
          <p className="text-2xl font-bold text-green-600">
            R$ {stats.totalRevenue.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Saldo Disponível</h3>
          <p className="text-2xl font-bold">
            R$ {stats.availableBalance.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Saldo Pendente</h3>
          <p className="text-2xl font-bold text-yellow-600">
            R$ {stats.pendingBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabela de Transações */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Últimas Transações</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Data</th>
                <th className="text-left py-3 px-4">Descrição</th>
                <th className="text-left py-3 px-4">Tipo</th>
                <th className="text-right py-3 px-4">Valor</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-b">
                  <td className="py-3 px-4">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">{transaction.description}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.type === 'credit' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'credit' ? 'Crédito' : 'Débito'}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-right ${
                    transaction.type === 'credit' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    R$ {transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 