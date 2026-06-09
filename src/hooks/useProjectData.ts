import { useMemo } from 'react';
import { createProjectActions } from '../state/projectStore';
import type { Project, ProjectData, Task } from '../types';
import { useLocalStorage } from './useLocalStorage';

const TASK_START_X = 48;
const TASK_START_Y = 48;
const TASK_COLUMN_GAP = 260;
const TASK_ROW_GAP = 190;
const TASK_COLUMNS = 3;

type StoredTask = Task | (Omit<Task, 'x' | 'y' | 'checklist'> & Partial<Pick<Task, 'x' | 'y' | 'checklist'>>);

function normalizeTask(task: StoredTask, index: number): Task {
  return {
    ...task,
    x: typeof task.x === 'number' ? task.x : TASK_START_X + (index % TASK_COLUMNS) * TASK_COLUMN_GAP,
    y: typeof task.y === 'number' ? task.y : TASK_START_Y + Math.floor(index / TASK_COLUMNS) * TASK_ROW_GAP,
    checklist: Array.isArray(task.checklist) ? task.checklist : [],
  };
}

function normalizeProjects(projects: Project[]): Project[] {
  return projects.map((project) => ({
    ...project,
    tasks: project.tasks.map(normalizeTask),
  }));
}

export function useProjectData(): ProjectData {
  const [projects, setProjects] = useLocalStorage<Project[]>('team-flow-system-projects', [], normalizeProjects);
  const actions = useMemo(() => createProjectActions(setProjects), [setProjects]);
  return { projects, ...actions };
}
