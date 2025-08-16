import { useMemo } from 'react';
import type { Role } from './models';

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

export default function Timeline({
  title,
  roles
}: {
  title: string;
  roles: Role[];
}) {
  const items = useMemo(() => sortByRecent(roles), [roles]);

  return (
    <section className="cv-section">
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
              <li
                className="timeline-item"
                key={`${r.company}-${r.title}-${i}`}
              >
                {/* Year badge */}
                <div className="timeline-year">{displayYear}</div>

                {/* Marker with icon */}
                <div className="timeline-icon" aria-hidden="true">
                  {r.icon ?? '•'}
                </div>

                {/* Card */}
                <article className="timeline-content">
                  <h3>
                    {r.company} — {r.title}
                  </h3>

                  <div className="timeline-meta">
                    {r.period}
                    {r.location ? <> · {r.location}</> : null}
                    {r.website ? (
                      <>
                        {' '}
                        ·{' '}
                        <a href={r.website} target="_blank" rel="noreferrer">
                          Company Site
                        </a>
                      </>
                    ) : null}
                  </div>

                  {r.summary ? (
                    <p dangerouslySetInnerHTML={{ __html: r.summary }} />
                  ) : null}

                  {r.achievements?.length ? (
                    <ul>
                      {r.achievements.map((a, j) => (
                        <li key={j} dangerouslySetInnerHTML={{ __html: a }} />
                      ))}
                    </ul>
                  ) : null}

                  {r.tech ? (
                    <p className="timeline-tech">
                      <strong>Tech</strong> {r.tech}
                    </p>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
