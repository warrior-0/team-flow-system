import type { Project, Task } from '../../types';
import { createTaskLabel } from '../../utils/taskHelpers';
import StatusBadge from './StatusBadge';

type TaskNodeProps = {
  task: Task;
  project: Project;
  index: number;
  selected: boolean;
  onSelect: (taskId: string) => void;
};

export default function TaskNode({ task, project, index, selected, onSelect }: TaskNodeProps) {
  return <button className={`task-node ${selected ? 'selected' : ''}`} onClick={() => onSelect(task.id)} style={{ animationDelay: `${index * 40}ms` }}><StatusBadge status={task.status} /><strong>{task.title}</strong><small>{createTaskLabel(task, project)}</small></button>;
}
