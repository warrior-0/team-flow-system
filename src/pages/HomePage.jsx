import CreateProjectForm from '../components/home/CreateProjectForm';
import ProjectList from '../components/home/ProjectList';

export default function HomePage({ projects, onCreateProject, onDeleteProject, onOpenProject }) {
  return (
    <section className="home-layout">
      <div className="hero-card">
        <p className="eyebrow">Project Hub</p>
        <h2>프로젝트를 만들고 팀 흐름을 시작하세요.</h2>
        <p>팀원, 과제, 의존성 그래프를 한 프로젝트 안에서 관리합니다. 모든 데이터는 브라우저 localStorage에 저장됩니다.</p>
        <CreateProjectForm onCreateProject={onCreateProject} />
      </div>
      <ProjectList projects={projects} onDeleteProject={onDeleteProject} onOpenProject={onOpenProject} />
    </section>
  );
}
