import { type ReactNode } from 'react';
import Section from './Section';
import CardGrid from './CardGrid';
import StatCard from './StatCard';
import { StatItem } from '../models';

interface PortfolioStatsProps {
  stats: StatItem[];
}

export default function PortfolioStats({
  stats
}: PortfolioStatsProps): ReactNode {
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
