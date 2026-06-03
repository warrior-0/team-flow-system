import { useMemo } from 'react';
import { createProjectActions } from '../state/projectStore';
import { useLocalStorage } from './useLocalStorage';

export function useProjectData() {
  const [projects, setProjects] = useLocalStorage('team-flow-system-projects', []);
  const actions = useMemo(() => createProjectActions(setProjects), [setProjects]);
  return { projects, ...actions };
}
