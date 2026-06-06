import type { Edge, Task } from '../../types';
import FlowNode from './FlowNode';

type FlowCanvasProps = {
  nodes: Task[];
  edges: Edge[];
  selectedTaskId: string;
};

export default function FlowCanvas({ nodes, edges, selectedTaskId }: FlowCanvasProps) {
  if (!selectedTaskId) return <div className="flow-canvas empty-card">과제를 선택하면 해당 과제가 포함된 연결 컴포넌트 그래프가 표시됩니다.</div>;
  return <div className="flow-canvas"><div className="edge-summary"><h3>화살표</h3>{edges.length ? edges.map((edge) => { const from = nodes.find((node) => node.id === edge.from)?.title; const to = nodes.find((node) => node.id === edge.to)?.title; return <span key={edge.id}>{from} → {to}</span>; }) : <span>연결된 화살표 없음</span>}</div><div className="flow-nodes">{nodes.map((node, index) => <FlowNode key={node.id} task={node} index={index} selected={node.id === selectedTaskId} />)}</div></div>;
}
