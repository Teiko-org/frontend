import React, { useState } from 'react';
import CustomCard from '../CustomCard';

function KanbanBoard({ data, onCardMove, onCardClick }) {
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedLane, setDraggedLane] = useState(null);

  const handleDragStart = (e, card, laneId) => {
    setDraggedCard(card);
    setDraggedLane(laneId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetLaneId) => {
    e.preventDefault();
    
    if (draggedCard && draggedLane && draggedLane !== targetLaneId) {
      onCardMove(draggedLane, targetLaneId, draggedCard.id, 0);
    }
    
    setDraggedCard(null);
    setDraggedLane(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDraggedLane(null);
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 px-4">
      {data.lanes.map((lane) => (
        <div
          key={lane.id}
          className="kanban-lane"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, lane.id)}
        >
          <div className="kanban-lane-header">
            <h3 className="kanban-lane-title">{lane.title}</h3>
            <span className="kanban-lane-count">{lane.label}</span>
          </div>
          
          <div className="kanban-lane-body">
            {lane.cards.map((card) => (
              <div
                key={card.id}
                className="kanban-card-wrapper"
                draggable
                onDragStart={(e) => handleDragStart(e, card, lane.id)}
                onDragEnd={handleDragEnd}
                onClick={() => onCardClick(card.id, card.metadata, lane.id)}
              >
                <CustomCard
                  card={card}
                  metadata={card.metadata}
                  laneId={lane.id}
                />
              </div>
            ))}
            
            {lane.cards.length === 0 && (
              <div className="kanban-empty-lane">
                <p className="text-gray-500 text-sm text-center py-8">
                  Nenhum pedido nesta coluna
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KanbanBoard;

