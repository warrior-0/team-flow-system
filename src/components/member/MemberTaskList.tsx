import type { Project, Task } from '../../types';
import { createTaskLabel } from '../../utils/taskHelpers';
import StatusBadge from '../project/StatusBadge';

type MemberTaskListProps = {
  project: Project;
  tasks: Task[];
  selectedTaskId: string;
  onSelectTask: (taskId: string) => void;
};

export default function MemberTaskList({ project, tasks, selectedTaskId, onSelectTask }: MemberTaskListProps) {
  return (
    <aside className="member-task-list">
      <h3>팀원별 과제 목록</h3>
      {tasks.length ? tasks.map((task) => (
        <button key={task.id} className={task.id === selectedTaskId ? 'selected' : ''} onClick={() => onSelectTask(task.id)}>
          <StatusBadge status={task.status} />
          <span>{createTaskLabel(task, project)}</span>
        </button>
      )) : <p className="muted">이 팀원에게 배정된 과제가 없습니다.</p>}
    </aside>
  );
}
