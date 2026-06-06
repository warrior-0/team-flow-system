import type { ChangeEvent } from 'react';
import type { Project, Task, TaskChanges, TaskStatus } from '../../types';

type TaskEditorProps = {
  project: Project;
  task: Task | null;
  onUpdateTask: (changes: TaskChanges) => void;
  onDeleteTask: () => void;
};

export default function TaskEditor({ project, task, onUpdateTask, onDeleteTask }: TaskEditorProps) {
  if (!task) return <p className="muted">과제를 선택하면 제목, 세부내용, 담당자, 상태를 수정할 수 있습니다.</p>;

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onUpdateTask({ status: event.target.value as TaskStatus });
  };

  return (
    <div className="task-editor">
      <label>제목<input value={task.title} onChange={(event) => onUpdateTask({ title: event.target.value })} /></label>
      <label>세부내용<textarea value={task.details} onChange={(event) => onUpdateTask({ details: event.target.value })} /></label>
      <label>담당자<select value={task.assigneeId} onChange={(event) => onUpdateTask({ assigneeId: event.target.value })}><option value="">미지정</option>{project.members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label>
      <label>상태<select value={task.status} onChange={handleStatusChange}><option value="todo">TODO</option><option value="doing">DOING</option><option value="done">DONE</option></select></label>
      <button className="danger" onClick={onDeleteTask}>과제 삭제</button>
    </div>
  );
}
