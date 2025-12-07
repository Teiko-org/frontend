import CardOrder from "../CardOrder";
import React, { useState } from "react";

function ColumnOrder(props) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const draggedOrderId = e.dataTransfer.getData('text/plain');
    const draggedOrderStatus = e.dataTransfer.getData('application/json');
    
    if (draggedOrderId && draggedOrderStatus && draggedOrderStatus !== props.status) {
      props.onStatusChange(draggedOrderId, props.status);
    }
  };

  const handleDragStart = (e, order) => {
    e.dataTransfer.setData('text/plain', order.id);
    e.dataTransfer.setData('application/json', props.status);
    e.dataTransfer.effectAllowed = 'move';
    
    // Adiciona classe visual durante o drag
    e.target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    // Remove classe visual após o drag
    e.target.classList.remove('dragging');
  };

  return (
    <div className="flex flex-col h-full kanban-column">
      <div className="bg-bgHome p-2 w-[300px] border border-gold rounded-t-md border-b-0 text-center text-gold font-bold flex-shrink-0">
        {props.title}
      </div>
      <div 
        className={`bg-bgHome p-1 w-fit max-h-[calc(97vh-220px)] flex-1 border border-gold rounded-md rounded-tl-none transition-all duration-200 column-container ${
          isDragOver ? 'border-2 border-gold shadow-lg scale-105 drop-zone-active' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-y-3 p-2 w-[300px] h-full min-h-[520px] max-h-[calc(100vh-220px)] overflow-y-auto overflow-x-hidden border border-gold rounded-md bg-bgNativeHome column-scrollbar column-content">
          <div className="flex flex-col items-center gap-y-3 w-full flex-1">
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
              <div className="flex items-center justify-center flex-1 w-full border-2 border-dashed border-gray-300 rounded-lg text-gray-500 empty-drop-zone">
                <p className="text-sm text-center">
                  Arraste pedidos para cá
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColumnOrder;