import type { Task } from '../../types';
import StatusBadge from '../project/StatusBadge';

type FlowNodeProps = {
  task: Task;
  index: number;
  selected: boolean;
};

export default function FlowNode({ task, index, selected }: FlowNodeProps) {
  return <div className={`flow-node ${selected ? 'selected' : ''}`} style={{ gridColumn: (index % 3) + 1 }}><StatusBadge status={task.status} /><strong>{task.title}</strong><p>{task.details || '세부내용 없음'}</p></div>;
}
