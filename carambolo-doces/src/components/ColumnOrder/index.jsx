import CardOrder from "../CardOrder";
import React, { useState } from "react";

function ColumnOrder(props) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
    console.log(`🎯 Drag over na coluna: ${props.status}`);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    console.log(`👋 Drag leave da coluna: ${props.status}`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const draggedOrderId = e.dataTransfer.getData('text/plain');
    const draggedOrderStatus = e.dataTransfer.getData('application/json');
    
    console.log(`📥 Drop realizado na coluna: ${props.status}`);
    console.log(`📋 ID do pedido arrastado: ${draggedOrderId}`);
    console.log(`🏷️ Status anterior: ${draggedOrderStatus}`);
    console.log(`🎯 Status da coluna de destino: ${props.status}`);
    
    if (draggedOrderId && draggedOrderStatus && draggedOrderStatus !== props.status) {
      console.log(`✅ Drop válido! Alterando status do pedido ${draggedOrderId} de ${draggedOrderStatus} para ${props.status}`);
      
      // Chama a função para mudar o status do pedido
      props.onStatusChange(draggedOrderId, props.status);
    } else {
      if (draggedOrderStatus === props.status) {
        console.log(`⚠️ Drop inválido: Tentativa de arrastar para a mesma coluna (${props.status})`);
      } else {
        console.log(`❌ Drop inválido: Dados insuficientes ou inválidos`);
        console.log(`   - ID: ${draggedOrderId}`);
        console.log(`   - Status: ${draggedOrderStatus}`);
      }
    }
  };

  const handleDragStart = (e, order) => {
    console.log(`🚀 Iniciando drag do pedido ${order.id} da coluna ${props.status}`);
    
    e.dataTransfer.setData('text/plain', order.id);
    e.dataTransfer.setData('application/json', props.status);
    e.dataTransfer.effectAllowed = 'move';
    
    // Adiciona classe visual durante o drag
    e.target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    console.log(`🏁 Finalizando drag do pedido`);
    // Remove classe visual após o drag
    e.target.classList.remove('dragging');
  };

  return (
    <div className="flex flex-col h-full kanban-column">
      <div className="bg-gradient-blue p-2 w-[200px] border border-gold rounded-t-md border-b-0 text-center text-gold font-bold flex-shrink-0">
        {props.title}
      </div>
      <div 
        className={`bg-gradient-blue p-1 w-fit h-full border border-gold rounded-md rounded-tl-none transition-all duration-200 flex-1 column-container ${
          isDragOver ? 'border-2 border-gold shadow-lg scale-105 drop-zone-active' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-y-3 p-3 w-[300px] h-full max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden border border-gold rounded-md bg-bgHome column-scrollbar column-content">
          {(props.orderFilter || []).map((order) => (
            <div
              key={order.id}
              data-order-id={order.id}
              draggable
              onDragStart={(e) => handleDragStart(e, order)}
              onDragEnd={handleDragEnd}
              className="cursor-grab active:cursor-grabbing transition-transform duration-200 hover:scale-105 kanban-card-wrapper"
            >
              <CardOrder
                order={order}
                orderStatus={props.status}
                orderSummaryId={order.id}
                onStatusChange={props.onStatusChange}
              />
            </div>
          ))}
          
          {/* Área de drop vazia quando não há pedidos */}
          {(!props.orderFilter || props.orderFilter.length === 0) && (
            <div className="flex items-center justify-center h-32 w-full border-2 border-dashed border-gray-300 rounded-lg text-gray-500 empty-drop-zone">
              <p className="text-sm text-center">
                Arraste pedidos para cá
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ColumnOrder;
