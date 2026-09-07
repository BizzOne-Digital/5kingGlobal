import { Badge } from './Badge';

const TONES: Record<string, 'neutral' | 'gold' | 'success' | 'warning' | 'danger' | 'info'> = {
  pending: 'warning',
  contacted: 'info',
  confirmed: 'success',
  completed: 'success',
  cancelled: 'danger',
  unread: 'warning',
  read: 'info',
  replied: 'success',
  archived: 'neutral',
  draft: 'neutral',
  published: 'success',
  active: 'success',
  inactive: 'neutral',
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={TONES[status] || 'neutral'}>{status}</Badge>;
}
