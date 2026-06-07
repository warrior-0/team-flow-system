import { useCallback, useMemo, useState } from 'react';
import TopBar from './components/TopBar';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import MemberPage from './pages/MemberPage';
import { useProjectData } from './hooks/useProjectData';
import './App.css';
import type { MemberViewState, PageId } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

const PAGES = { HOME: 'home', PROJECT: 'project', MEMBER: 'member' } as const;
const EMPTY_MEMBER_VIEW_STATE: MemberViewState = { projectId: '', memberId: '', taskId: '' };
const MEMBER_VIEW_STORAGE_KEY = 'team-flow-system-member-view';

function normalizeMemberViewState(value: MemberViewState): MemberViewState {
  return {
    projectId: typeof value?.projectId === 'string' ? value.projectId : '',
    memberId: typeof value?.memberId === 'string' ? value.memberId : '',
    taskId: typeof value?.taskId === 'string' ? value.taskId : '',
  };
}

export default function App() {
  const projectData = useProjectData();
  const { projects } = projectData;
  const [page, setPage] = useState<PageId>(PAGES.HOME);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [memberViewState, setMemberViewState] = useLocalStorage<MemberViewState>(MEMBER_VIEW_STORAGE_KEY, EMPTY_MEMBER_VIEW_STATE, normalizeMemberViewState);

  const selectedProject = useMemo(() => projects.find((project) => project.id === selectedProjectId) || projects[0] || null, [projects, selectedProjectId]);
  const activeProjectId = selectedProject?.id || '';

  const openProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setPage(PAGES.PROJECT);
  };

  const updateMemberViewState = useCallback((selection: MemberViewState) => {
    setMemberViewState(normalizeMemberViewState(selection));
  }, [setMemberViewState]);

  const openMember = (projectId = '', memberId = '') => {
    updateMemberViewState({ projectId, memberId, taskId: '' });
    setPage(PAGES.MEMBER);
  };

  return (
    <div className="app-shell">
      <TopBar currentPage={page} onNavigate={setPage} />
      <main className="page-shell">
        {page === PAGES.HOME && <HomePage projects={projects} onCreateProject={projectData.addProject} onDeleteProject={projectData.deleteProject} onOpenProject={openProject} />}
        {page === PAGES.PROJECT && <ProjectPage project={selectedProject} projects={projects} selectedProjectId={activeProjectId} onSelectProject={setSelectedProjectId} actions={projectData} onOpenMember={openMember} />}
        {page === PAGES.MEMBER && <MemberPage projects={projects} selection={memberViewState} onSelectionChange={updateMemberViewState} />}
      </main>
    </div>
  );
}
