import { useEffect, useMemo, useState } from 'react';
import TopBar from './components/TopBar';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import MemberPage from './pages/MemberPage';
import { useProjectData } from './hooks/useProjectData';
import './App.css';
import type { PageId } from './types';

const PAGES = { HOME: 'home', PROJECT: 'project', MEMBER: 'member' } as const;

export default function App() {
  const projectData = useProjectData();
  const { projects } = projectData;
  const [page, setPage] = useState<PageId>(PAGES.HOME);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [memberRoute, setMemberRoute] = useState({ projectId: '', memberId: '' });

  const selectedProject = useMemo(() => projects.find((project) => project.id === selectedProjectId) || null, [projects, selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId && !projects.some((project) => project.id === selectedProjectId)) {
      setSelectedProjectId(projects[0]?.id || '');
    }
  }, [projects, selectedProjectId]);

  const openProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setPage(PAGES.PROJECT);
  };

  const openMember = (projectId = '', memberId = '') => {
    setMemberRoute({ projectId, memberId });
    setPage(PAGES.MEMBER);
  };

  return (
    <div className="app-shell">
      <TopBar currentPage={page} onNavigate={setPage} />
      <main className="page-shell">
        {page === PAGES.HOME && <HomePage projects={projects} onCreateProject={projectData.addProject} onDeleteProject={projectData.deleteProject} onOpenProject={openProject} />}
        {page === PAGES.PROJECT && <ProjectPage project={selectedProject} projects={projects} selectedProjectId={selectedProjectId} onSelectProject={setSelectedProjectId} actions={projectData} onOpenMember={openMember} />}
        {page === PAGES.MEMBER && <MemberPage projects={projects} initialProjectId={memberRoute.projectId} initialMemberId={memberRoute.memberId} />}
      </main>
    </div>
  );
}
