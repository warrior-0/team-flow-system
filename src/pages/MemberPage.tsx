import { useEffect, useMemo, useState } from 'react';
import ProjectPicker from '../components/member/ProjectPicker';
import MemberPicker from '../components/member/MemberPicker';
import MemberTaskList from '../components/member/MemberTaskList';
import MemberProgress from '../components/member/MemberProgress';
import FlowCanvas from '../components/member/FlowCanvas';
import type { Edge, Project, Task } from '../types';
import { getTaskSubgraph } from '../utils/graph';

type MemberPageProps = {
  projects: Project[];
  initialProjectId?: string;
  initialMemberId?: string;
};

export default function MemberPage({ projects, initialProjectId = '', initialMemberId = '' }: MemberPageProps) {
  const [projectId, setProjectId] = useState(initialProjectId);
  const [memberId, setMemberId] = useState(initialMemberId);
  const [taskId, setTaskId] = useState('');

  useEffect(() => {
    if (initialProjectId) setProjectId(initialProjectId);
    if (initialMemberId) setMemberId(initialMemberId);
  }, [initialProjectId, initialMemberId]);

  const project = projects.find((item) => item.id === projectId) || null;
  const member = project?.members.find((item) => item.id === memberId) || null;
  const memberTasks = useMemo(() => (project ? project.tasks.filter((task) => task.assigneeId === memberId) : []), [project, memberId]);
  const selectedTask = memberTasks.find((task) => task.id === taskId) || null;
  const subgraph = useMemo<{ nodes: Task[]; edges: Edge[] }>(() => {
    if (!project || !selectedTask) return { nodes: [], edges: [] };
    const memberTaskIds = new Set(memberTasks.map((task) => task.id));
    const memberEdges = project.edges.filter((edge) => memberTaskIds.has(edge.from) && memberTaskIds.has(edge.to));
    return getTaskSubgraph(memberTasks, memberEdges, selectedTask.id);
  }, [project, selectedTask, memberTasks]);

  if (!project) return <ProjectPicker projects={projects} onSelectProject={(id) => { setProjectId(id); setMemberId(''); setTaskId(''); }} />;
  if (!member) return <MemberPicker project={project} onBack={() => { setProjectId(''); setMemberId(''); setTaskId(''); }} onSelectMember={(id) => { setMemberId(id); setTaskId(''); }} />;

  return (
    <section className="member-layout">
      <div className="section-header">
        <div><p className="eyebrow">Member Flow</p><h2>{project.name} · {member.name}</h2></div>
        <div className="button-row"><button onClick={() => { setProjectId(''); setMemberId(''); setTaskId(''); }}>프로젝트 선택으로</button><button onClick={() => { setMemberId(''); setTaskId(''); }}>팀원 선택으로</button><button onClick={() => setTaskId('')}>과제 수행도 보기로</button></div>
      </div>
      <MemberProgress tasks={memberTasks} />
      <div className="member-content">
        <MemberTaskList tasks={memberTasks} selectedTaskId={taskId} onSelectTask={setTaskId} />
        <FlowCanvas nodes={subgraph.nodes} edges={subgraph.edges} selectedTaskId={taskId} />
      </div>
    </section>
  );
}
