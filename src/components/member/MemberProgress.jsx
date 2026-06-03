import { getMemberProgress } from '../../utils/progress';

export default function MemberProgress({ tasks }) {
  const progress = getMemberProgress(tasks);
  return <div className="progress-panel"><strong>수행도 {progress.percent}%</strong><div className="meter"><span style={{ width: `${progress.percent}%` }} /></div><p>TODO {progress.todo} · DOING {progress.doing} · DONE {progress.done} · 총 {progress.total}</p></div>;
}
