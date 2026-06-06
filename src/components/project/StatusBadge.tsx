import type { TaskStatus } from '../../types';
import { getStatusLabel } from '../../utils/taskHelpers';

type StatusBadgeProps = {
  status: TaskStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-${status}`}>{getStatusLabel(status)}</span>;
}
