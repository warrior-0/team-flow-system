import { getStatusLabel } from '../../utils/taskHelpers';

export default function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}>{getStatusLabel(status)}</span>;
}
