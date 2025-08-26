import { type ReactNode } from 'react';

import Section from './Section';
import CardGrid from './CardGrid';
import StatCard from './StatCard';
import { StatItem } from '../models';

interface StatsProps {
  stats: StatItem[];
}

export default function Stats({ stats }: StatsProps): ReactNode {
  return (
    <Section className="stats">
      <CardGrid className="statsGrid">
        {stats.map((stat: StatItem, idx: number) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </CardGrid>
    </Section>
  );
}
