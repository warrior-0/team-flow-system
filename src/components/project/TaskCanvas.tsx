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

function getCanvasSize(tasks: Task[]) {
  const maxX = tasks.reduce((max, task) => Math.max(max, task.x + NODE_WIDTH + CANVAS_PADDING), CANVAS_MIN_WIDTH);
  const maxY = tasks.reduce((max, task) => Math.max(max, task.y + NODE_HEIGHT + CANVAS_PADDING), CANVAS_MIN_HEIGHT);
  return { width: maxX, height: maxY };
}

function EdgeLayer({ tasks, edges }: { tasks: Task[]; edges: Edge[] }) {
  const taskMap = new Map(tasks.map((task) => [task.id, task]));
  return (
    <svg className="task-edge-layer" aria-label="과제 의존성 그래프">
      <defs>
        <marker id="task-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      {edges.map((edge) => {
        const from = taskMap.get(edge.from);
        const to = taskMap.get(edge.to);
        if (!from || !to) return null;
        return <path key={edge.id} className="task-edge" d={createEdgeBezierPath(from, to, edge, edges, { nodeWidth: NODE_WIDTH, nodeHeight: NODE_HEIGHT })} markerEnd="url(#task-arrow)" />;
      })}
    </svg>
  );
}

export default function TaskCanvas({ project, selectedTaskId, onSelectTask, onMoveTask }: TaskCanvasProps) {
  const canvasSize = getCanvasSize(project.tasks);

  if (!project.tasks.length) {
    return <div className="task-canvas empty-task-canvas"><p className="muted">과제를 생성하면 TODO 상태로 여기에 표시됩니다.</p></div>;
  }

  return (
    <div className="task-canvas" style={{ minWidth: canvasSize.width, minHeight: canvasSize.height }}>
      <EdgeLayer tasks={project.tasks} edges={project.edges} />
      {project.tasks.map((task, index) => (
        <TaskNode key={task.id} task={task} project={project} index={index} selected={task.id === selectedTaskId} onSelect={onSelectTask} onMove={onMoveTask} />
      ))}
    </div>
  );
}
