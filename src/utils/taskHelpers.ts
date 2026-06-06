import type { Project, Task, TaskStatus } from '../types';

export const STATUS_LABELS: Record<TaskStatus, string> = { todo: 'TODO', doing: 'DOING', done: 'DONE' };

export function getAssigneeName(project: Project, assigneeId: string): string {
  return project.members.find((member) => member.id === assigneeId)?.name || '미지정';
}

export function getStatusLabel(status: TaskStatus): string {
  return STATUS_LABELS[status] || STATUS_LABELS.todo;
}

export function createTaskLabel(task: Task, project: Project): string {
  return `${task.title} · ${getAssigneeName(project, task.assigneeId)} · ${getStatusLabel(task.status)}`;
}
