import type { Edge, Task } from '../../types';
import FlowNode from './FlowNode';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 150;
const CANVAS_MIN_WIDTH = 760;
const CANVAS_MIN_HEIGHT = 520;
const CANVAS_PADDING = 96;

type FlowCanvasProps = {
  nodes: Task[];
  edges: Edge[];
  selectedTaskId: string;
};

function getCanvasSize(tasks: Task[]) {
  const maxX = tasks.reduce((max, task) => Math.max(max, task.x + NODE_WIDTH + CANVAS_PADDING), CANVAS_MIN_WIDTH);
  const maxY = tasks.reduce((max, task) => Math.max(max, task.y + NODE_HEIGHT + CANVAS_PADDING), CANVAS_MIN_HEIGHT);
  return { width: maxX, height: maxY };
}

function createBezierPath(from: Task, to: Task): string {
  const startX = from.x + NODE_WIDTH;
  const startY = from.y + NODE_HEIGHT / 2;
  const endX = to.x;
  const endY = to.y + NODE_HEIGHT / 2;
  const distance = Math.max(Math.abs(endX - startX) * 0.45, 120);
  return `M ${startX} ${startY} C ${startX + distance} ${startY}, ${endX - distance} ${endY}, ${endX} ${endY}`;
}

function FlowEdgeLayer({ nodes, edges }: { nodes: Task[]; edges: Edge[] }) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  return (
    <svg className="flow-edge-layer" aria-label="선택 과제 연결 컴포넌트 그래프">
      <defs>
        <marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      {edges.map((edge) => {
        const from = nodeMap.get(edge.from);
        const to = nodeMap.get(edge.to);
        if (!from || !to) return null;
        return <path key={edge.id} className="flow-edge" d={createBezierPath(from, to)} markerEnd="url(#flow-arrow)" />;
      })}
    </svg>
  );
}

export default function FlowCanvas({ nodes, edges, selectedTaskId }: FlowCanvasProps) {
  if (!selectedTaskId) return <div className="flow-canvas empty-card">과제를 선택하면 해당 과제가 포함된 연결 컴포넌트 그래프가 표시됩니다.</div>;

  const canvasSize = getCanvasSize(nodes);

  return (
    <div className="flow-canvas">
      <div className="edge-summary">
        <h3>화살표</h3>
        {edges.length ? edges.map((edge) => {
          const from = nodes.find((node) => node.id === edge.from)?.title;
          const to = nodes.find((node) => node.id === edge.to)?.title;
          return <span key={edge.id}>{from} → {to}</span>;
        }) : <span>연결된 화살표 없음</span>}
      </div>
      <div className="flow-graph" style={{ minWidth: canvasSize.width, minHeight: canvasSize.height }}>
        <FlowEdgeLayer nodes={nodes} edges={edges} />
        {nodes.map((node) => <FlowNode key={node.id} task={node} selected={node.id === selectedTaskId} />)}
      </div>
    </div>
  );
}
