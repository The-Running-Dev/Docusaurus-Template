import React from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd';

export interface ReorderProps {
  projects: any[];
  onReorder: (newOrder: any[]) => void;
}

export const DragDropReorder: React.FC<ReorderProps> = ({
  projects,
  onReorder
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(projects);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    onReorder(reordered);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="projects-list" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {projects.map((project, idx) => (
              <Draggable key={project.id} draggableId={project.id} index={idx}>
                {(prov) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                  >
                    {/* Render project card here */}
                    <div className="project-card">{project.title}</div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
