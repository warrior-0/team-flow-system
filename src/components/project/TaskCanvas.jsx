import TaskNode from './TaskNode';

export default function TaskCanvas({ project, selectedTaskId, onSelectTask }) {
  return <div className="task-canvas">{project.tasks.length ? project.tasks.map((task, index) => <TaskNode key={task.id} task={task} project={project} index={index} selected={task.id === selectedTaskId} onSelect={onSelectTask} />) : <p className="muted">과제를 생성하면 TODO 상태로 여기에 표시됩니다.</p>}</div>;
}
