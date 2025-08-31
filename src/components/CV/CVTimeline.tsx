import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRocket,
  faLightbulb,
  faCreditCard,
  faChartLine,
  faHammer,
  faBriefcase
} from '@fortawesome/free-solid-svg-icons';
import type { Role } from './models';
import TechTags from './TechTags';

import './cv-timeline.css';

function parsePeriod(period: string): { start: number; end: number } {
  // Supports: "2019 – 2022", "2013–2014", "2022 – Present", etc.
  const norm = period.replace(/\s/g, '');
  const m = norm.match(/(\d{4})[–-](\d{4}|Present|Now)/i);
  if (!m) {
    const y = (norm.match(/\d{4}/) || ['0'])[0];
    const year = Number(y);
    return { start: year || 0, end: year || 0 };
  }
  const start = Number(m[1]);
  const end = /present|now/i.test(m[2])
    ? new Date().getFullYear()
    : Number(m[2]);
  return { start, end };
}

function sortByRecent(roles: Role[]): Role[] {
  // Most recent first (by end year, then start year)
  return [...roles].sort((a, b) => {
    const A = parsePeriod(a.period);
    const B = parsePeriod(b.period);
    if (B.end !== A.end) return B.end - A.end;
    return B.start - A.start;
  });
}

const iconMap = {
  faRocket,
  faLightbulb,
  faCreditCard,
  faChartLine,
  faHammer,
  faBriefcase
};

export default function Timeline({
  title,
  roles
}: {
  title: string;
  roles: Role[];
}) {
  const items = useMemo(() => sortByRecent(roles), [roles]);

  return (
    <section className="cv-section" id="experience">
      <h2>{title}</h2>

      <div className="vertical-timeline">
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {items.map((r, i) => {
            const { start, end } = parsePeriod(r.period);
            const displayYear =
              end === new Date().getFullYear()
                ? start.toString()
                : start === end
                  ? start.toString()
                  : `${start}–${end}`;

            return (
              <li className="timeline-item" key={`${r.title}-${i}`}>
                <div className="timeline-year">{displayYear}</div>

                <div className="timeline-icon" aria-hidden="true">
                  <FontAwesomeIcon 
                    icon={r.icon && iconMap[r.icon as keyof typeof iconMap] 
                      ? iconMap[r.icon as keyof typeof iconMap] 
                      : faBriefcase
                    } 
                  />
                </div>

                <article className="timeline-content">
                  <header className="timeline-header">
                    <h3>{r.company}</h3>
                    <h4>{r.title}</h4>
                  </header>

                  <div className="timeline-meta">
                    <span className="timeline-period">{r.period}</span>
                    {r.location && (
                      <span className="timeline-location">📍 {r.location}</span>
                    )}
                    {r.website && (
                      <a 
                        href={r.website} 
                        target="_blank" 
                        rel="noreferrer"
                        className="timeline-website"
                      >
                        🔗 Visit Site
                      </a>
                    )}
                  </div>

                  {r.summary && (
                    <div 
                      className="timeline-summary"
                      dangerouslySetInnerHTML={{ __html: r.summary }} 
                    />
                  )}

                  {r.achievements?.length && (
                    <div className="timeline-achievements">
                      <h5>Key Achievements</h5>
                      <ul>
                        {r.achievements.map((achievement, j) => (
                          <li 
                            key={j} 
                            dangerouslySetInnerHTML={{ __html: achievement }} 
                          />
                        ))}
                      </ul>
                    </div>
                  )}

                  {r.tech && (
                    <div className="timeline-tech">
                      <TechTags techString={r.tech} className="timeline-tech-tags" />
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      </div>

      <a href="#" className="cv-back-to-top">↑ Back to Top</a>
    </section>
  );
}
