import { useEffect, useState } from 'react';
import MemberList from '../components/project/MemberList';
import MemberEditor from '../components/project/MemberEditor';
import TaskCanvas from '../components/project/TaskCanvas';
import PropertyPanel from '../components/project/PropertyPanel';

export default function ProjectPage({ project, projects, selectedProjectId, onSelectProject, actions, onOpenMember }) {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => setSelectedTaskId(''), [selectedProjectId]);

  if (!projects.length) return <div className="empty-card">생성된 프로젝트가 없습니다.</div>;
  if (!project) return <div className="empty-card">프로젝트를 선택하세요.</div>;

  const selectedTask = project.tasks.find((task) => task.id === selectedTaskId) || null;
  const handleTaskSubmit = (event) => {
    event.preventDefault();
    if (!newTaskTitle.trim()) return;
    const taskId = actions.addTask(project.id, newTaskTitle);
    setSelectedTaskId(taskId);
    setNewTaskTitle('');
  };

  return (
    <section className="project-layout">
      <aside className="side-panel">
        <label className="field-label">프로젝트 선택</label>
        <select value={selectedProjectId} onChange={(event) => onSelectProject(event.target.value)}>
          {projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <MemberEditor onAddMember={(member) => actions.addMember(project.id, member)} />
        <MemberList project={project} onUpdateMember={(memberId, changes) => actions.updateMember(project.id, memberId, changes)} onDeleteMember={(memberId) => actions.deleteMember(project.id, memberId)} onOpenMember={(memberId) => onOpenMember(project.id, memberId)} />
      </aside>
      <div className="workspace">
        <div className="section-header">
          <div><p className="eyebrow">Task Canvas</p><h2>{project.name}</h2></div>
          <form className="inline-form" onSubmit={handleTaskSubmit}>
            <input value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} placeholder="TODO 과제 제목" />
            <button type="submit">과제 생성</button>
          </form>
        </div>
        <TaskCanvas project={project} selectedTaskId={selectedTaskId} onSelectTask={setSelectedTaskId} />
      </div>
      <PropertyPanel project={project} task={selectedTask} onUpdateTask={(changes) => actions.updateTask(project.id, selectedTask.id, changes)} onDeleteTask={() => { actions.deleteTask(project.id, selectedTask.id); setSelectedTaskId(''); }} onAddEdge={(from, to) => actions.addEdge(project.id, from, to)} onDeleteEdge={(edgeId) => actions.deleteEdge(project.id, edgeId)} />
    </section>
  );
}
