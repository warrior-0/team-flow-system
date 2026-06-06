import type { Project } from '../../types';
import TaskNode from './TaskNode';

type TaskCanvasProps = {
  project: Project;
  selectedTaskId: string;
  onSelectTask: (taskId: string) => void;
};

export default function TaskCanvas({ project, selectedTaskId, onSelectTask }: TaskCanvasProps) {
  return <div className="task-canvas">{project.tasks.length ? project.tasks.map((task, index) => <TaskNode key={task.id} task={task} project={project} index={index} selected={task.id === selectedTaskId} onSelect={onSelectTask} />) : <p className="muted">과제를 생성하면 TODO 상태로 여기에 표시됩니다.</p>}</div>;
}
