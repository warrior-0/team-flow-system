import type { Task } from '../../types';
import StatusBadge from '../project/StatusBadge';

type MemberTaskListProps = {
  tasks: Task[];
  selectedTaskId: string;
  onSelectTask: (taskId: string) => void;
};

export default function MemberTaskList({ tasks, selectedTaskId, onSelectTask }: MemberTaskListProps) {
  return (
    <aside className="member-task-list">
      <h3>팀원별 과제 목록</h3>
      {tasks.length ? tasks.map((task) => (
        <button key={task.id} className={task.id === selectedTaskId ? 'selected' : ''} onClick={() => onSelectTask(task.id)}>
          <StatusBadge status={task.status} />
          <strong>{task.title}</strong>
        </button>
      )) : <p className="muted">이 팀원에게 배정된 과제가 없습니다.</p>}
    </aside>
  );
}
