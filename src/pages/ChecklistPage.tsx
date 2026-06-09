import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import ProjectPicker from '../components/member/ProjectPicker';
import MemberPicker from '../components/member/MemberPicker';
import MemberTaskList from '../components/member/MemberTaskList';
import StatusBadge from '../components/project/StatusBadge';
import type { MemberViewState, Project, ProjectActions } from '../types';
import { getStatusLabel } from '../utils/taskHelpers';

type ChecklistPageProps = {
  projects: Project[];
  selection: MemberViewState;
  onSelectionChange: (selection: MemberViewState) => void;
  actions: Pick<ProjectActions, 'addChecklistItem' | 'toggleChecklistItem' | 'deleteChecklistItem'>;
};

type ChecklistPanelProps = {
  projectId: string;
  task: Project['tasks'][number] | null;
  actions: ChecklistPageProps['actions'];
};

function ChecklistPanel({ projectId, task, actions }: ChecklistPanelProps) {
  const [newItemContent, setNewItemContent] = useState('');

  if (!task) {
    return (
      <aside className="property-panel checklist-panel">
        <p className="eyebrow">Checklist</p>
        <h2>체크리스트</h2>
        <p className="muted">과제를 선택하면 해당 과제 안에서 해야 할 일과 완료한 일을 관리할 수 있습니다.</p>
      </aside>
    );
  }

  const doneCount = task.checklist.filter((item) => item.done).length;
  const totalCount = task.checklist.length;
  const percent = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    actions.addChecklistItem(projectId, task.id, newItemContent);
    setNewItemContent('');
  };

  return (
    <aside className="property-panel checklist-panel">
      <p className="eyebrow">Checklist</p>
      <div className="checklist-title-row">
        <div>
          <h2>{task.title}</h2>
          <p className="muted">상태: {getStatusLabel(task.status)}</p>
        </div>
        <StatusBadge status={task.status} />
      </div>

      <div className="checklist-progress">
        <div className="progress-meta">
          <strong>{percent}% 완료</strong>
          <span>{doneCount}/{totalCount}</span>
        </div>
        <div className="meter"><span style={{ width: `${percent}%` }} /></div>
      </div>

      <form className="inline-form checklist-form" onSubmit={handleSubmit}>
        <input
          value={newItemContent}
          onChange={(event) => setNewItemContent(event.target.value)}
          placeholder="예: API 응답 예외 처리 확인"
          aria-label="새 체크리스트 항목"
        />
        <button type="submit">추가</button>
      </form>

      <div className="checklist-items">
        {task.checklist.length === 0 ? (
          <p className="muted">아직 체크리스트가 없습니다. 이 과제에서 해야 할 일을 추가하세요.</p>
        ) : task.checklist.map((item) => (
          <div key={item.id} className={`checklist-item ${item.done ? 'done' : ''}`}>
            <label>
              <input type="checkbox" checked={item.done} onChange={() => actions.toggleChecklistItem(projectId, task.id, item.id)} />
              <span>{item.content}</span>
            </label>
            <button type="button" onClick={() => actions.deleteChecklistItem(projectId, task.id, item.id)}>삭제</button>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function ChecklistPage({ projects, selection, onSelectionChange, actions }: ChecklistPageProps) {
  const { projectId, memberId, taskId } = selection;
  const project = projects.find((item) => item.id === projectId) || null;
  const member = project?.members.find((item) => item.id === memberId) || null;
  const memberTasks = useMemo(() => (project && member ? project.tasks.filter((task) => task.assigneeId === member.id) : []), [project, member]);
  const selectedTask = memberTasks.find((task) => task.id === taskId) || null;

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
    <section className="member-layout checklist-layout">
      <div className="section-header">
        <div>
          <p className="eyebrow">Checklist</p>
          <h2>{project.name} · {member.name}</h2>
          <p className="muted">Project 페이지의 과제 상태와 별개로, 선택한 과제 안의 세부 할 일을 체크리스트로 관리합니다.</p>
        </div>
        <div className="button-row">
          <button onClick={() => onSelectionChange({ projectId: '', memberId: '', taskId: '' })}>프로젝트 선택으로</button>
          <button onClick={() => updateSelection({ memberId: '', taskId: '' })}>팀원 선택으로</button>
        </div>
      </div>

      <div className="checklist-content">
        <MemberTaskList tasks={memberTasks} selectedTaskId={taskId} onSelectTask={(id) => updateSelection({ taskId: id })} />
        <ChecklistPanel projectId={project.id} task={selectedTask} actions={actions} />
      </div>
    </section>
  );
}
