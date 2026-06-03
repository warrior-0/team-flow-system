import TaskEditor from './TaskEditor';
import EdgeEditor from './EdgeEditor';

export default function PropertyPanel({ project, task, onUpdateTask, onDeleteTask, onAddEdge, onDeleteEdge }) {
  return <aside className="property-panel"><p className="eyebrow">Property Panel</p><h2>과제 속성창</h2><TaskEditor project={project} task={task} onUpdateTask={onUpdateTask} onDeleteTask={onDeleteTask} /><EdgeEditor project={project} task={task} onAddEdge={onAddEdge} onDeleteEdge={onDeleteEdge} /></aside>;
}
