import { useRef } from 'react';
import type { PointerEvent } from 'react';
import type { Project, Task } from '../../types';
import { createTaskLabel } from '../../utils/taskHelpers';
import StatusBadge from './StatusBadge';

type TaskNodeProps = {
  task: Task;
  project: Project;
  index: number;
  selected: boolean;
  onSelect: (taskId: string) => void;
  onMove: (taskId: string, x: number, y: number) => void;
};

type DragState = {
  pointerId: number;
  offsetX: number;
  offsetY: number;
};

export default function TaskNode({ task, project, index, selected, onSelect, onMove }: TaskNodeProps) {
  const dragState = useRef<DragState | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    const canvas = event.currentTarget.offsetParent;
    if (!(canvas instanceof HTMLElement)) return;
    const canvasRect = canvas.getBoundingClientRect();
    dragState.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - canvasRect.left - task.x,
      offsetY: event.clientY - canvasRect.top - task.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    onSelect(task.id);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const currentDrag = dragState.current;
    const canvas = event.currentTarget.offsetParent;
    if (!currentDrag || currentDrag.pointerId !== event.pointerId || !(canvas instanceof HTMLElement)) return;
    const canvasRect = canvas.getBoundingClientRect();
    const nextX = Math.max(16, event.clientX - canvasRect.left - currentDrag.offsetX);
    const nextY = Math.max(16, event.clientY - canvasRect.top - currentDrag.offsetY);
    onMove(task.id, Math.round(nextX), Math.round(nextY));
  };

  const stopDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (dragState.current?.pointerId === event.pointerId) dragState.current = null;
  };

  return (
    <button
      className={`task-node ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(task.id)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      style={{ left: task.x, top: task.y, animationDelay: `${index * 40}ms` }}
    >
      <StatusBadge status={task.status} />
      <strong>{task.title}</strong>
      <small>{createTaskLabel(task, project)}</small>
    </button>
  );
}
