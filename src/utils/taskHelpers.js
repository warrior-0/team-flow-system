export const STATUS_LABELS = { todo: 'TODO', doing: 'DOING', done: 'DONE' };

export function getAssigneeName(project, assigneeId) {
  return project.members.find((member) => member.id === assigneeId)?.name || '미지정';
}

export function getStatusLabel(status) {
  return STATUS_LABELS[status] || STATUS_LABELS.todo;
}

export function createTaskLabel(task, project) {
  return `${task.title} · ${getAssigneeName(project, task.assigneeId)} · ${getStatusLabel(task.status)}`;
}
