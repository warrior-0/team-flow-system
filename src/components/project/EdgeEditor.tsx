import type { Project, Task } from '../../types';

type EdgeEditorProps = {
  project: Project;
  task: Task | null;
  onAddEdge: (from: string, to: string) => void;
  onDeleteEdge: (edgeId: string) => void;
};

export default function EdgeEditor({ project, task, onAddEdge, onDeleteEdge }: EdgeEditorProps) {
  if (!task) return null;
  const targets = project.tasks.filter((item) => item.id !== task.id);
  return (
    <div className="edge-editor">
      <h3>의존성 화살표</h3>
      <label>현재 과제에서 후속 과제로<select defaultValue="" onChange={(event) => { if (event.target.value) onAddEdge(task.id, event.target.value); event.target.value = ''; }}><option value="">후속 과제 선택</option>{targets.map((target) => <option key={target.id} value={target.id}>{target.title}</option>)}</select></label>
      <label>선행 과제에서 현재 과제로<select defaultValue="" onChange={(event) => { if (event.target.value) onAddEdge(event.target.value, task.id); event.target.value = ''; }}><option value="">선행 과제 선택</option>{targets.map((target) => <option key={target.id} value={target.id}>{target.title}</option>)}</select></label>
      <div className="edge-list">{project.edges.filter((edge) => edge.from === task.id || edge.to === task.id).map((edge) => { const from = project.tasks.find((item) => item.id === edge.from)?.title; const to = project.tasks.find((item) => item.id === edge.to)?.title; return <div key={edge.id}><span>{from} → {to}</span><button onClick={() => onDeleteEdge(edge.id)}>삭제</button></div>; })}</div>
    </div>
  );
}
