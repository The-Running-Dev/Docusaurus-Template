import Timeline from './CVTimeline';

import DataComponent from '../DataComponent';
import { Features } from '../../config/FeaturesConfig';
import { CVData } from './models';
import { DEFAULT_CV_DATA } from './constants';

import './cv.css';
import './cv-reader.css';

export default function CV() {
  return (
    <DataComponent<CVData> feature={Features.CVPage} defaultData={DEFAULT_CV_DATA}>
      {(userCVData, loading, error, meta) => {
        if (loading) {
          return (
            <div className="cv-wrap">
              <p className="cv-muted">Loading CV data...</p>
            </div>
          );
        }

        if (error) {
          return (
            <div className="cv-wrap">
              <p className="cv-muted">Failed to load CV data. Using default data.</p>
            </div>
          );
        }
        if (!userCVData?.header) {
          // last-resort guard to avoid crashing the page
          return (
            <div className="cv-wrap">
              <p className="cv-muted">No CV data found.</p>
            </div>
          );
        }

        const {
          header,
          about,
          badges,
          chips,
          timelineTitle,
          roles,
          educationTitle,
          education,
          quote
        } = userCVData;

        return (
          <div className="cv-wrap">
            <header className="cv-header">
              <h1>{header.title}</h1>

              <div className="cv-row cv-muted">
                {header.email && (
                  <>
                    📧 <a href={`mailto:${header.email}`}>{header.email}</a>
                  </>
                )}
                {header.phone && (
                  <>
                    <span aria-hidden> · </span> 📱 {header.phone}
                  </>
                )}
              </div>

              {header.links?.length ? (
                <div className="cv-links">
                  {header.links.map((l, i) => (
                    <a key={i} href={l.href} target="_blank" rel="noreferrer">
                      {l.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </header>

            <section className="cv-section">
              <h2>{about.title}</h2>
              <p dangerouslySetInnerHTML={{ __html: about.body }} />
            </section>

            {badges?.length || chips?.length ? (
              <section className="cv-section">
                <h2>🛠️ Tech at a Glance</h2>

                {badges?.length ? (
                  <div className="cv-badges" aria-label="Technology badges">
                    {badges.map((b, i) => (
                      <img key={i} src={b.src} alt={b.alt} loading="lazy" />
                    ))}
                  </div>
                ) : null}

                {chips?.length ? (
                  <div
                    className="cv-row"
                    style={{ marginTop: badges?.length ? '0.5rem' : 0 }}
                  >
                    {chips.map((c, i) => (
                      <span className="cv-chip" key={i}>
                        {c}
                      </span>
                    ))}
                  </div>
                ) : null}
              </section>
            ) : null}

            <Timeline title={timelineTitle} roles={roles} />

            {education?.length ? (
              <section className="cv-section">
                <h2>{educationTitle ?? '🎓 Education & Growth'}</h2>
                <ul>
                  {education.map((e, i) => (
                    <li key={i}>
                      <strong>{e.degree}</strong> — {e.school}
                      {e.details ? (
                        <>
                          {' '}
                          — <span className="cv-muted">{e.details}</span>
                        </>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {quote ? (
              <section className="cv-section">
                <div
                  className="cv-quote"
                  dangerouslySetInnerHTML={{ __html: quote }}
                />
              </section>
            ) : null}

            {process.env.NODE_ENV === 'development' && meta && (
              <div className="debug-panel">
                <h3>Debug Info</h3>
                <p>Provider: {meta.provider}</p>
                <p>Source: {meta.source}</p>
                <p>Data Size: {meta.dataSize} bytes</p>
                <p>Timestamp: {meta.timestamp}</p>
                {meta.endpoint && <p>Endpoint: {meta.endpoint}</p>}
                {meta.cached !== undefined && <p>Cached: {meta.cached ? 'Yes' : 'No'}</p>}
              </div>
            )}
          </div>
        );
      }}
    </DataComponent>
  );
}
