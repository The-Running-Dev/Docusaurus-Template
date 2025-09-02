import { type ReactNode } from 'react';
import { ProjectStats as ProjectStatsType } from '../../../../shared/types/project-types';

interface ProjectStatsProps {
  stats: ProjectStatsType;
}

/**
 * ProjectStats component
 * Displays key statistics about the projects in a grid layout
 */
export default function ProjectStats({ stats }: ProjectStatsProps): ReactNode {
  const statsArray = [
    {
      number: stats.totalProjects,
      label: 'Total'
    },
    {
      number: stats.recentProjects,
      label: 'Recent'
    },
    {
      number: stats.totalTechnologies,
      label: stats.totalTechnologies === 1 ? 'Technology' : 'Technologies'
    },
    {
      number: stats.averageAge,
      label: 'Average Age'
    }
  ];

  return (
    <section className="stats">
      <div className="container">
        <div className="statsGrid">
          {statsArray.map((stat, idx) => (
            <div key={idx} className="statItem">
              <div className="statNumber">{stat.number}</div>
              <div className="statLabel">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
