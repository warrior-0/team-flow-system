import type { Project } from '../../types';
import ProjectCard from './ProjectCard';

type ProjectListProps = {
  projects: Project[];
  onDeleteProject: (projectId: string) => void;
  onOpenProject: (projectId: string) => void;
};

export default function ProjectList({ projects, onDeleteProject, onOpenProject }: ProjectListProps) {
  if (!projects.length) return <div className="empty-card">생성된 프로젝트가 없습니다. 홈에서 첫 프로젝트를 만들어 보세요.</div>;
  return <div className="project-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} onDeleteProject={onDeleteProject} onOpenProject={onOpenProject} />)}</div>;
}
