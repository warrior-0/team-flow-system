import type { Project, Task, TaskChanges } from '../../types';
import TaskEditor from './TaskEditor';
import EdgeEditor from './EdgeEditor';

type PropertyPanelProps = {
  project: Project;
  task: Task | null;
  onUpdateTask: (changes: TaskChanges) => void;
  onDeleteTask: () => void;
  onAddEdge: (from: string, to: string) => void;
  onDeleteEdge: (edgeId: string) => void;
};

export default function PropertyPanel({ project, task, onUpdateTask, onDeleteTask, onAddEdge, onDeleteEdge }: PropertyPanelProps) {
  return <aside className="property-panel"><p className="eyebrow">Property Panel</p><h2>과제 속성창</h2><TaskEditor project={project} task={task} onUpdateTask={onUpdateTask} onDeleteTask={onDeleteTask} /><EdgeEditor project={project} task={task} onAddEdge={onAddEdge} onDeleteEdge={onDeleteEdge} /></aside>;
}
