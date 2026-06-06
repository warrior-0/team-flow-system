import type { Project, Task } from '../types';

export function getProjectProgress(project: Project) {
  const total = project.tasks.length;
  const done = project.tasks.filter((task) => task.status === 'done').length;
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
}

export function getMemberProgress(tasks: Task[]) {
  const total = tasks.length;
  const done = tasks.filter((task) => task.status === 'done').length;
  const doing = tasks.filter((task) => task.status === 'doing').length;
  const todo = tasks.filter((task) => task.status === 'todo').length;
  return { total, done, doing, todo, percent: total ? Math.round((done / total) * 100) : 0 };
}
