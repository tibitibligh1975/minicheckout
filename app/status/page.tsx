'use client';

import { useEffect, useState } from 'react';
import { API_URLS } from '@/config/api';

interface Order {
  _id: string;
  id: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  customerName: string;
  customerEmail: string;
  pixCode: string;
}

export default function StatusPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('Buscando pedidos...'); // Log antes de buscar
        const response = await fetch(API_URLS.orders);
        console.log('Status da resposta:', response.status); // Log do status
        
        if (!response.ok) {
          throw new Error('Falha ao carregar pedidos');
        }
        
        const data = await response.json();
        console.log('Pedidos recebidos:', data); // Log dos pedidos
        setOrders(data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // Atualiza a cada 30 segundos
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Status dos Pedidos</h1>
      
      {loading ? (
        <div>Carregando...</div>
      ) : orders.length === 0 ? (
        <div>Nenhum pedido encontrado</div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div 
              key={order._id}
              className="border p-4 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{order.customerName}</h3>
                  <p className="text-sm text-gray-600">{order.customerEmail}</p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status === 'completed' ? 'Pago' :
                   order.status === 'failed' ? 'Falhou' :
                   'Pendente'}
                </span>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                <p>Valor: R$ {order.amount.toFixed(2)}</p>
                <p>Data: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 