import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import MemberList from '../components/project/MemberList';
import MemberEditor from '../components/project/MemberEditor';
import TaskCanvas from '../components/project/TaskCanvas';
import PropertyPanel from '../components/project/PropertyPanel';
import type { MemberChanges, NewMember, Project, ProjectData, TaskChanges } from '../types';

type ProjectPageProps = {
  project: Project | null;
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
  actions: ProjectData;
  onOpenMember: (projectId: string, memberId: string) => void;
};

export default function ProjectPage({ project, projects, selectedProjectId, onSelectProject, actions, onOpenMember }: ProjectPageProps) {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => setSelectedTaskId(''), [selectedProjectId]);

  if (!projects.length) return <div className="empty-card">생성된 프로젝트가 없습니다.</div>;
  if (!project) return <div className="empty-card">프로젝트를 선택하세요.</div>;

  const selectedTask = project.tasks.find((task) => task.id === selectedTaskId) || null;
  const handleTaskSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTaskTitle.trim()) return;
    const taskId = actions.addTask(project.id, newTaskTitle);
    setSelectedTaskId(taskId);
    setNewTaskTitle('');
  };

  const updateSelectedTask = (changes: TaskChanges) => {
    if (!selectedTask) return;
    actions.updateTask(project.id, selectedTask.id, changes);
  };

  const deleteSelectedTask = () => {
    if (!selectedTask) return;
    actions.deleteTask(project.id, selectedTask.id);
    setSelectedTaskId('');
  };

  return (
    <section className="project-layout">
      <aside className="side-panel">
        <label className="field-label">프로젝트 선택</label>
        <select value={selectedProjectId} onChange={(event) => onSelectProject(event.target.value)}>
          {projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <MemberEditor onAddMember={(member: NewMember) => actions.addMember(project.id, member)} />
        <MemberList project={project} onUpdateMember={(memberId: string, changes: MemberChanges) => actions.updateMember(project.id, memberId, changes)} onDeleteMember={(memberId: string) => actions.deleteMember(project.id, memberId)} onOpenMember={(memberId: string) => onOpenMember(project.id, memberId)} />
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
      <PropertyPanel project={project} task={selectedTask} onUpdateTask={updateSelectedTask} onDeleteTask={deleteSelectedTask} onAddEdge={(from, to) => actions.addEdge(project.id, from, to)} onDeleteEdge={(edgeId) => actions.deleteEdge(project.id, edgeId)} />
    </section>
  );
}
