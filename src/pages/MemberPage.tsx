import { useEffect, useMemo } from 'react';
import ProjectPicker from '../components/member/ProjectPicker';
import MemberPicker from '../components/member/MemberPicker';
import MemberTaskList from '../components/member/MemberTaskList';
import MemberProgress from '../components/member/MemberProgress';
import FlowCanvas from '../components/member/FlowCanvas';
import type { Edge, MemberViewState, Project, Task } from '../types';
import { getTaskSubgraph } from '../utils/graph';
import { getAssigneeName, getStatusLabel } from '../utils/taskHelpers';

type MemberPageProps = {
  projects: Project[];
  selection: MemberViewState;
  onSelectionChange: (selection: MemberViewState) => void;
};

type MemberTaskPropertyPanelProps = {
  project: Project;
  task: Task | null;
};

function MemberTaskPropertyPanel({ project, task }: MemberTaskPropertyPanelProps) {
  return (
    <aside className="property-panel member-property-panel">
      <p className="eyebrow">Property Panel</p>
      <h2>과제 속성창</h2>
      {task ? (
        <div className="task-editor readonly-task-editor">
          <label>제목<input value={task.title} readOnly /></label>
          <label>담당자<input value={getAssigneeName(project, task.assigneeId)} readOnly /></label>
          <label>상태<input value={getStatusLabel(task.status)} readOnly /></label>
          <label>세부내용<textarea value={task.details || '세부내용 없음'} readOnly /></label>
          <p className="muted">상태 변경은 Project 페이지의 Property Panel에서만 가능합니다.</p>
        </div>
      ) : <p className="muted">과제를 선택하면 세부내용을 확인할 수 있습니다.</p>}
    </aside>
  );
}

export default function MemberPage({ projects, selection, onSelectionChange }: MemberPageProps) {
  const { projectId, memberId, taskId } = selection;
  const project = projects.find((item) => item.id === projectId) || null;
  const member = project?.members.find((item) => item.id === memberId) || null;
  const memberTasks = useMemo(() => (project ? project.tasks.filter((task) => task.assigneeId === memberId) : []), [project, memberId]);
  const selectedTask = memberTasks.find((task) => task.id === taskId) || null;
  const subgraph = useMemo<{ nodes: Task[]; edges: Edge[] }>(() => {
    if (!project || !selectedTask) return { nodes: [], edges: [] };
    return getTaskSubgraph(project.tasks, project.edges, selectedTask.id);
  }, [project, selectedTask]);

  useEffect(() => {
    if (!project && (projectId || memberId || taskId)) {
      onSelectionChange({ projectId: '', memberId: '', taskId: '' });
      return;
    }

    if (project && !member && (memberId || taskId)) {
      onSelectionChange({ projectId: project.id, memberId: '', taskId: '' });
      return;
    }

    if (project && member && taskId && !selectedTask) {
      onSelectionChange({ projectId: project.id, memberId: member.id, taskId: '' });
    }
  }, [member, memberId, onSelectionChange, project, projectId, selectedTask, taskId]);

  const updateSelection = (changes: Partial<MemberViewState>) => {
    onSelectionChange({ projectId, memberId, taskId, ...changes });
  };

  if (!project) return <ProjectPicker projects={projects} onSelectProject={(id) => onSelectionChange({ projectId: id, memberId: '', taskId: '' })} />;
  if (!member) return <MemberPicker project={project} onBack={() => onSelectionChange({ projectId: '', memberId: '', taskId: '' })} onSelectMember={(id) => onSelectionChange({ projectId: project.id, memberId: id, taskId: '' })} />;

  return (
    <section className="member-layout">
      <div className="section-header">
        <div><p className="eyebrow">Member Flow</p><h2>{project.name} · {member.name}</h2></div>
        <div className="button-row"><button onClick={() => onSelectionChange({ projectId: '', memberId: '', taskId: '' })}>프로젝트 선택으로</button><button onClick={() => updateSelection({ memberId: '', taskId: '' })}>팀원 선택으로</button></div>
      </div>
      <MemberProgress tasks={memberTasks} />
      <div className="member-content">
        <MemberTaskList tasks={memberTasks} selectedTaskId={taskId} onSelectTask={(id) => updateSelection({ taskId: id })} />
        <FlowCanvas project={project} nodes={subgraph.nodes} edges={subgraph.edges} selectedTaskId={taskId} onSelectTask={(id) => updateSelection({ taskId: id })} />
        <MemberTaskPropertyPanel project={project} task={selectedTask} />
      </div>
    </section>
  );
}
