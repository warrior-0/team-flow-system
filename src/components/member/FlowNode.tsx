import type { Project, Task } from '../../types';
import { createTaskLabel } from '../../utils/taskHelpers';
import StatusBadge from '../project/StatusBadge';

type FlowNodeProps = {
  project: Project;
  task: Task;
  selected: boolean;
  onSelectTask: (taskId: string) => void;
};

export default function FlowNode({ project, task, selected, onSelectTask }: FlowNodeProps) {
  return (
    <button className={`flow-node ${selected ? 'selected' : ''}`} onClick={() => onSelectTask(task.id)} style={{ left: task.x, top: task.y }}>
      <StatusBadge status={task.status} />
      <strong>{task.title}</strong>
      <small>{createTaskLabel(task, project)}</small>
    </button>
  );
}
