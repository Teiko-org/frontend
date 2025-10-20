import React, { useState } from 'react';
import ColumnOrder from '../ColumnOrder';
import orderSummary from '../../services/orderSummary';
import {
  orderSummaryStatusCancelado,
  orderSummaryStatusConcluido,
  orderSummaryStatusPago,
  orderSummaryStatusPendente,
} from '../../service/orderSummaryStatus';

function KanbanDragDropDemo() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dragLogs, setDragLogs] = useState([]);

  // Carrega os dados reais
  React.useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await orderSummary();
        setOrders(Array.isArray(data) ? data : []);
        console.log('📊 Dados carregados (API):', data);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Função para mudar o status via drag and drop (API real)
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const timestamp = new Date().toLocaleTimeString();
      const logMessage = `🔄 ${timestamp} - Mudando status do pedido ${orderId} para ${newStatus}`;
      setDragLogs((prev) => [...prev, logMessage]);

      // Atualização otimista
      let previousStatus = null;
      setOrders((prevOrders) =>
        prevOrders.map((o) => {
          if (o.id === orderId) {
            previousStatus = o.status;
            return { ...o, status: newStatus };
          }
          return o;
        })
      );

      if (newStatus === 'CANCELADO') await orderSummaryStatusCancelado(orderId);
      else if (newStatus === 'PENDENTE') await orderSummaryStatusPendente(orderId);
      else if (newStatus === 'PAGO') await orderSummaryStatusPago(orderId);
      else if (newStatus === 'CONCLUIDO') await orderSummaryStatusConcluido(orderId);

      const successLog = `✅ ${new Date().toLocaleTimeString()} - Status alterado com sucesso: Pedido ${orderId} → ${newStatus}`;
      setDragLogs((prev) => [...prev, successLog]);
    } catch (error) {
      const errorLog = `❌ ${new Date().toLocaleTimeString()} - Erro ao alterar status: ${error.message}`;
      console.error(errorLog);
      setDragLogs((prev) => [...prev, errorLog]);

      // Reverte a mudança em caso de erro
      setOrders((prevOrders) => prevOrders.map((o) => (o.id === orderId ? { ...o, status: o.status } : o)));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <p className="text-xl text-blue mb-4">Carregando pedidos...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bgNativeHome min-h-full p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue mb-4">🎯 Kanban Drag & Drop Demo</h1>
          <p className="text-lg text-gray-600">Arraste os pedidos entre as colunas para testar a funcionalidade</p>
        </header>

        <div className="flex justify-evenly items-start gap-8">
          <ColumnOrder title="Pedidos Cancelados" orderFilter={orders.filter((item) => item.status === 'CANCELADO')} status="CANCELADO" onStatusChange={handleStatusChange} />
          <ColumnOrder title="Pedidos Pendentes" orderFilter={orders.filter((item) => item.status === 'PENDENTE')} status="PENDENTE" onStatusChange={handleStatusChange} />
          <ColumnOrder title="Pedidos Pagos" orderFilter={orders.filter((item) => item.status === 'PAGO')} status="PAGO" onStatusChange={handleStatusChange} />
          <ColumnOrder title="Pedidos Concluídos" orderFilter={orders.filter((item) => item.status === 'CONCLUIDO')} status="CONCLUIDO" onStatusChange={handleStatusChange} />
        </div>

        {/* Logs de drag and drop */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📋 Logs de Drag & Drop</h3>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {dragLogs.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma ação realizada ainda...</p>
            ) : (
              dragLogs.map((log, index) => (
                <div key={index} className="text-sm font-mono bg-white p-2 rounded border">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-600">
          <p>Total de pedidos: {orders.length}</p>
        </footer>
      </div>
    </div>
  );
}

export default KanbanDragDropDemo;
