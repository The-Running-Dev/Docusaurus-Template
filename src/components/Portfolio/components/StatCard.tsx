import { type ReactNode } from 'react';
import { StatItem } from '../models';

interface StatCardProps {
  stat: StatItem;
}

export default function StatCard({ stat }: StatCardProps): ReactNode {
  return (
    <div className="statItem">
      <div className="statNumber">{stat.number}</div>
      <div className="statLabel">{stat.label}</div>
    </div>
  );
}