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
  onPreviewMove: (taskId: string, x: number, y: number) => void;
  onMove: (taskId: string, x: number, y: number) => void;
};

type DragState = {
  pointerId: number;
  offsetX: number;
  offsetY: number;
  x: number;
  y: number;
};

export default function TaskNode({ task, project, index, selected, onSelect, onPreviewMove, onMove }: TaskNodeProps) {
  const dragState = useRef<DragState | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    const canvas = event.currentTarget.offsetParent;
    if (!(canvas instanceof HTMLElement)) return;
    const canvasRect = canvas.getBoundingClientRect();
    dragState.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - canvasRect.left - task.x,
      offsetY: event.clientY - canvasRect.top - task.y,
      x: task.x,
      y: task.y,
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
    const roundedX = Math.round(nextX);
    const roundedY = Math.round(nextY);
    currentDrag.x = roundedX;
    currentDrag.y = roundedY;
    event.currentTarget.style.left = `${roundedX}px`;
    event.currentTarget.style.top = `${roundedY}px`;
    onPreviewMove(task.id, roundedX, roundedY);
  };

  const releasePointer = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const commitDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const currentDrag = dragState.current;
    if (!currentDrag || currentDrag.pointerId !== event.pointerId) return;

    dragState.current = null;
    releasePointer(event);
    if (currentDrag.x !== task.x || currentDrag.y !== task.y) onMove(task.id, currentDrag.x, currentDrag.y);
  };

  const cancelDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const currentDrag = dragState.current;
    if (!currentDrag || currentDrag.pointerId !== event.pointerId) return;

    dragState.current = null;
    releasePointer(event);
    event.currentTarget.style.left = `${task.x}px`;
    event.currentTarget.style.top = `${task.y}px`;
    onPreviewMove(task.id, task.x, task.y);
  };

  return (
    <button
      className={`task-node ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(task.id)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={commitDrag}
      onPointerCancel={cancelDrag}
      style={{ left: task.x, top: task.y, animationDelay: `${index * 40}ms` }}
    >
      <StatusBadge status={task.status} />
      <strong>{task.title}</strong>
      <small>{createTaskLabel(task, project)}</small>
    </button>
  );
}
