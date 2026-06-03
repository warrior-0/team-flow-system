import { createTaskLabel } from '../../utils/taskHelpers';
import StatusBadge from './StatusBadge';

export default function TaskNode({ task, project, index, selected, onSelect }) {
  return <button className={`task-node ${selected ? 'selected' : ''}`} onClick={() => onSelect(task.id)} style={{ animationDelay: `${index * 40}ms` }}><StatusBadge status={task.status} /><strong>{task.title}</strong><small>{createTaskLabel(task, project)}</small></button>;
}
