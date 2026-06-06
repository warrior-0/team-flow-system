import type { Project } from '../../types';
import { getProjectProgress } from '../../utils/progress';

type ProjectCardProps = {
  project: Project;
  onDeleteProject: (projectId: string) => void;
  onOpenProject: (projectId: string) => void;
};

export default function ProjectCard({ project, onDeleteProject, onOpenProject }: ProjectCardProps) {
  const progress = getProjectProgress(project);
  return (
    <article className="project-card">
      <div className="card-header">
        <h3>{project.name}</h3>
        <span>{progress.percent}%</span>
      </div>
      <div className="meter"><span style={{ width: `${progress.percent}%` }} /></div>
      <p>{project.members.length}명 · 과제 {progress.total}개 · 완료 {progress.done}개</p>
      <div className="card-actions">
        <button onClick={() => onOpenProject(project.id)}>열기</button>
        <button className="danger" onClick={() => onDeleteProject(project.id)}>삭제</button>
      </div>
    </article>
  );
}
