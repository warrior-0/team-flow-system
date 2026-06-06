import { useMemo } from 'react';
import { createProjectActions } from '../state/projectStore';
import type { Project, ProjectData } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useProjectData(): ProjectData {
  const [projects, setProjects] = useLocalStorage<Project[]>('team-flow-system-projects', []);
  const actions = useMemo(() => createProjectActions(setProjects), [setProjects]);
  return { projects, ...actions };
}
