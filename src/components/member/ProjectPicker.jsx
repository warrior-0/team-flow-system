export default function ProjectPicker({ projects, onSelectProject }) {
  return <section className="picker-card"><p className="eyebrow">Step 1</p><h2>프로젝트 선택</h2>{projects.length ? projects.map((project) => <button key={project.id} onClick={() => onSelectProject(project.id)}>{project.name}</button>) : <p className="muted">생성된 프로젝트가 없습니다.</p>}</section>;
}
