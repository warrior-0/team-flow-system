import { useEffect, useRef, useState } from 'react';
import type { Edge, Project, Task } from '../../types';
import { createEdgeBezierPath } from '../../utils/graph';
import TaskNode from './TaskNode';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 142;
const CANVAS_MIN_WIDTH = 960;
const CANVAS_MIN_HEIGHT = 560;
const CANVAS_PADDING = 96;

type TaskCanvasProps = {
  project: Project;
  selectedTaskId: string;
  onSelectTask: (taskId: string) => void;
  onMoveTask: (taskId: string, x: number, y: number) => void;
};

type TaskPosition = Pick<Task, 'id' | 'x' | 'y'>;

type DragPreview = {
  taskId: string;
  x: number;
  y: number;
  nodeElement: HTMLElement;
};

type EdgePathCache = {
  edgeSignature: string;
  taskPositions: Map<string, TaskPosition>;
  paths: Map<string, string>;
};

function getCanvasSize(tasks: Task[]) {
  const maxX = tasks.reduce((max, task) => Math.max(max, task.x + NODE_WIDTH + CANVAS_PADDING), CANVAS_MIN_WIDTH);
  const maxY = tasks.reduce((max, task) => Math.max(max, task.y + NODE_HEIGHT + CANVAS_PADDING), CANVAS_MIN_HEIGHT);
  return { width: maxX, height: maxY };
}

function cloneTaskPosition(task: TaskPosition): TaskPosition {
  return { id: task.id, x: task.x, y: task.y };
}

function createTaskPositionMap(tasks: TaskPosition[]) {
  return new Map(tasks.map((task) => [task.id, cloneTaskPosition(task)]));
}

function getEdgeSignature(edges: Edge[]) {
  return edges.map((edge) => `${edge.id}:${edge.from}:${edge.to}`).join('|');
}

function findMovedTaskIds(previousPositions: Map<string, TaskPosition>, tasks: TaskPosition[]) {
  return tasks.reduce<string[]>((movedIds, task) => {
    const previous = previousPositions.get(task.id);
    if (!previous || previous.x !== task.x || previous.y !== task.y) movedIds.push(task.id);
    return movedIds;
  }, []);
}

function getConnectedEdges(edges: Edge[], taskIds: Iterable<string>) {
  const movedTaskIds = new Set(taskIds);
  return edges.filter((edge) => movedTaskIds.has(edge.from) || movedTaskIds.has(edge.to));
}

function createEdgePath(edge: Edge, edges: Edge[], taskPositions: Map<string, TaskPosition>) {
  const from = taskPositions.get(edge.from);
  const to = taskPositions.get(edge.to);
  if (!from || !to) return '';
  return createEdgeBezierPath(from as Task, to as Task, edge, edges, { nodeWidth: NODE_WIDTH, nodeHeight: NODE_HEIGHT });
}

function createFullEdgePathCache(tasks: TaskPosition[], edges: Edge[]): EdgePathCache {
  const taskPositions = createTaskPositionMap(tasks);
  return {
    edgeSignature: getEdgeSignature(edges),
    taskPositions,
    paths: new Map(edges.map((edge) => [edge.id, createEdgePath(edge, edges, taskPositions)])),
  };
}

function recalculateConnectedEdgePaths(cache: EdgePathCache, edges: Edge[], nextTaskPositions: Map<string, TaskPosition>, movedTaskIds: string[]): EdgePathCache {
  const nextPaths = new Map(cache.paths);
  getConnectedEdges(edges, movedTaskIds).forEach((edge) => {
    nextPaths.set(edge.id, createEdgePath(edge, edges, nextTaskPositions));
  });
  return { edgeSignature: getEdgeSignature(edges), taskPositions: nextTaskPositions, paths: nextPaths };
}

function reconcileEdgePathCache(cache: EdgePathCache, tasks: Task[], edges: Edge[]) {
  const nextEdgeSignature = getEdgeSignature(edges);
  if (cache.edgeSignature !== nextEdgeSignature) return createFullEdgePathCache(tasks, edges);

  const movedTaskIds = findMovedTaskIds(cache.taskPositions, tasks);
  if (!movedTaskIds.length) return cache;

  return recalculateConnectedEdgePaths(cache, edges, createTaskPositionMap(tasks), movedTaskIds);
}

function EdgeLayer({ edges, edgePaths, pathElementsRef }: { edges: Edge[]; edgePaths: Map<string, string>; pathElementsRef: React.RefObject<Map<string, SVGPathElement>> }) {
  return (
    <svg className="task-edge-layer" aria-label="과제 의존성 그래프">
      <defs>
        <marker id="task-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      {edges.map((edge) => {
        const path = edgePaths.get(edge.id);
        if (!path) return null;
        return (
          <path
            key={edge.id}
            ref={(element) => {
              if (element) pathElementsRef.current.set(edge.id, element);
              else pathElementsRef.current.delete(edge.id);
            }}
            className="task-edge"
            d={path}
            markerEnd="url(#task-arrow)"
          />
        );
      })}
    </svg>
  );
}

export default function TaskCanvas({ project, selectedTaskId, onSelectTask, onMoveTask }: TaskCanvasProps) {
  const canvasSize = getCanvasSize(project.tasks);
  const [edgePathCache, setEdgePathCache] = useState(() => createFullEdgePathCache(project.tasks, project.edges));
  const taskPositionsRef = useRef(edgePathCache.taskPositions);
  const edgePathsRef = useRef(edgePathCache.paths);
  const pathElementsRef = useRef(new Map<string, SVGPathElement>());
  const pendingDragPreviewRef = useRef<DragPreview | null>(null);
  const dragPreviewAnimationFrameRef = useRef<number | null>(null);

  const renderedEdgePathCache = reconcileEdgePathCache(edgePathCache, project.tasks, project.edges);

  useEffect(() => {
    taskPositionsRef.current = renderedEdgePathCache.taskPositions;
    edgePathsRef.current = renderedEdgePathCache.paths;
  }, [renderedEdgePathCache]);

  const renderDragPreviewFrame = ({ taskId, x, y, nodeElement }: DragPreview) => {
    const currentTask = taskPositionsRef.current.get(taskId);
    if (!currentTask) return;

    nodeElement.style.left = `${x}px`;
    nodeElement.style.top = `${y}px`;

    const nextTaskPositions = new Map(taskPositionsRef.current);
    nextTaskPositions.set(taskId, { ...currentTask, x, y });
    taskPositionsRef.current = nextTaskPositions;

    getConnectedEdges(project.edges, [taskId]).forEach((edge) => {
      const nextPath = createEdgePath(edge, project.edges, nextTaskPositions);
      edgePathsRef.current.set(edge.id, nextPath);
      pathElementsRef.current.get(edge.id)?.setAttribute('d', nextPath);
    });
  };

  const scheduleDragPreview = (taskId: string, x: number, y: number, nodeElement: HTMLElement) => {
    pendingDragPreviewRef.current = { taskId, x, y, nodeElement };

    if (dragPreviewAnimationFrameRef.current !== null) return;

    dragPreviewAnimationFrameRef.current = requestAnimationFrame(() => {
      dragPreviewAnimationFrameRef.current = null;
      const nextPreview = pendingDragPreviewRef.current;
      pendingDragPreviewRef.current = null;
      if (nextPreview) renderDragPreviewFrame(nextPreview);
    });
  };

  useEffect(() => {
    return () => {
      if (dragPreviewAnimationFrameRef.current !== null) cancelAnimationFrame(dragPreviewAnimationFrameRef.current);
    };
  }, []);

  const commitTaskPosition = (taskId: string, x: number, y: number) => {
    const currentTask = renderedEdgePathCache.taskPositions.get(taskId);
    if (!currentTask) return;

    const nextTaskPositions = new Map(renderedEdgePathCache.taskPositions);
    nextTaskPositions.set(taskId, { ...currentTask, x, y });
    setEdgePathCache(recalculateConnectedEdgePaths(renderedEdgePathCache, project.edges, nextTaskPositions, [taskId]));
    onMoveTask(taskId, x, y);
  };

  if (!project.tasks.length) {
    return <div className="task-canvas empty-task-canvas"><p className="muted">과제를 생성하면 TODO 상태로 여기에 표시됩니다.</p></div>;
  }

  return (
    <div className="task-canvas" style={{ minWidth: canvasSize.width, minHeight: canvasSize.height }}>
      <EdgeLayer edges={project.edges} edgePaths={renderedEdgePathCache.paths} pathElementsRef={pathElementsRef} />
      {project.tasks.map((task, index) => (
        <TaskNode
          key={task.id}
          task={task}
          project={project}
          index={index}
          selected={task.id === selectedTaskId}
          onSelect={onSelectTask}
          onPreviewMove={scheduleDragPreview}
          onMove={commitTaskPosition}
        />
      ))}
    </div>
  );
}
