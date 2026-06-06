import type { Task } from '../../types';
import StatusBadge from '../project/StatusBadge';

type FlowNodeProps = {
  task: Task;
  selected: boolean;
};

export default function FlowNode({ task, selected }: FlowNodeProps) {
  return (
    <div className={`flow-node ${selected ? 'selected' : ''}`} style={{ left: task.x, top: task.y }}>
      <StatusBadge status={task.status} />
      <strong>{task.title}</strong>
      <p>{task.details || '세부내용 없음'}</p>
    </div>
  );
}
