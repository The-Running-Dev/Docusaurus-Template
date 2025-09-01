import DataProvider from '../DataProvider';
import DebugInfo from '../DebugInfo';
import Loading from '../Loading';
import Timeline from './CVTimeline';
import TechTags from './TechTags';

import { Features } from '../../config/FeaturesConfig';
import { CVData } from './models';
import { DEFAULT_CV_DATA } from './constants';

import './cv.css';
import './cv-reader.css';

export default function CV() {
  return (
    <DataProvider<CVData>
      feature={Features.CVPage}
      defaultData={DEFAULT_CV_DATA}
    >
      {(userCVData, loading, error, meta) => {
        if (loading) {
          return <Loading message="🔄 Loading CV..." useWrap={true} />;
        }

        if (error) {
          return (
            <div className="cv-wrap">
              <p className="cv-muted">
                Failed to Load CV Data. Using Default Data.
              </p>
            </div>
          );
        }
        if (!userCVData?.header) {
          // last-resort guard to avoid crashing the page
          return (
            <div className="cv-wrap">
              <p className="cv-muted">No CV Data Found.</p>
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
          projectsTitle,
          projects,
          openSourceTitle,
          openSource,
          timelineProjectsTitle,
          timelineProjects,
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
                      {l.label} |{' '}
                    </a>
                  ))}
                </div>
              ) : null}
            </header>

            {/* Section Navigation */}
            <nav className="cv-navigation" id="top">
              <div className="cv-nav-links">
                {(badges?.length || chips?.length) && (
                  <a href="#tech" className="cv-nav-link">🛠️ Tech Stack</a>
                )}
                <a href="#experience" className="cv-nav-link">💼 Experience</a>
                {projects?.length && (
                  <a href="#projects" className="cv-nav-link">🚀 Projects</a>
                )}
                {openSource?.length && (
                  <a href="#opensource" className="cv-nav-link">🌟 Open Source</a>
                )}
                {timelineProjects?.length && (
                  <a href="#timeline-projects" className="cv-nav-link">📈 Timeline</a>
                )}
                {education?.length && (
                  <a href="#education" className="cv-nav-link">🎓 Education</a>
                )}
              </div>
            </nav>

            <section className="cv-section" id="about">
              <h2>{about.title}</h2>
              <p dangerouslySetInnerHTML={{ __html: about.body }} />
              <a href="#" className="cv-back-to-top">↑ Back to Top</a>
            </section>

            {badges?.length || chips?.length ? (
              <section className="cv-section" id="tech">
                <h2>🛠️ Tech at a Glance</h2>

                {badges?.length ? (
                  <div className="cv-badges" aria-label="Technology badges">
                    {badges.map((b, i) => (
                      <img key={i} src={b.src} alt={b.alt} loading="lazy" />
                    ))}
                  </div>
                ) : null}

                {chips?.length ? (
                  <div className={`cv-row ${badges?.length ? 'cv-chips-with-badges' : 'cv-chips-only'}`}>
                    {chips.map((c, i) => (
                      <span className="cv-chip" key={i}>
                        {c}
                      </span>
                    ))}
                  </div>
                ) : null}

                <a href="#" className="cv-back-to-top">↑ Back to Top</a>
              </section>
            ) : null}

            <Timeline title={timelineTitle} roles={roles} />

            {projects?.length ? (
              <section className="cv-section" id="projects">
                <h2>{projectsTitle ?? '🚀 Recent Projects'}</h2>
                <div className="cv-projects-grid">
                  {projects.map((project, i) => (
                    <div key={i} className="cv-project-card">
                      <h3 className="cv-project-title">
                        {project.link ? (
                          <a href={project.link} target="_blank" rel="noreferrer">
                            {project.title} <span className="external-link">↗</span>
                          </a>
                        ) : (
                          project.title
                        )}
                      </h3>
                      <p className="cv-project-description">{project.description}</p>
                      <div className="cv-project-meta">
                        <span className="cv-project-year">{project.year}</span>
                        <TechTags techString={project.tech} />
                      </div>
                    </div>
                  ))}
                </div>
                <a href="#" className="cv-back-to-top">↑ Back to Top</a>
              </section>
            ) : null}

            {openSource?.length ? (
              <section className="cv-section" id="opensource">
                <h2>{openSourceTitle ?? '🌟 Open Source Contributions'}</h2>
                <div className="cv-opensource-grid">
                  {openSource.map((contrib, i) => (
                    <div key={i} className="cv-opensource-card">
                      <h3 className="cv-opensource-title">
                        {contrib.link ? (
                          <a href={contrib.link} target="_blank" rel="noreferrer">
                            {contrib.title} <span className="external-link">↗</span>
                          </a>
                        ) : (
                          contrib.title
                        )}
                      </h3>
                      <p className="cv-opensource-description">{contrib.description}</p>
                      <p className="cv-opensource-impact">
                        <strong>Impact:</strong> {contrib.impact}
                      </p>
                      <TechTags techString={contrib.tech} />
                    </div>
                  ))}
                </div>
                <a href="#" className="cv-back-to-top">↑ Back to Top</a>
              </section>
            ) : null}

            {timelineProjects?.length ? (
              <section className="cv-section" id="timeline-projects">
                <h2>{timelineProjectsTitle ?? '📈 Career Timeline & Key Projects'}</h2>
                <div className="cv-timeline-projects">
                  {timelineProjects.map((timeline, i) => (
                    <div key={i} className="cv-timeline-period">
                      <h3 className="cv-timeline-period-title">{timeline.period}</h3>
                      <p className="cv-timeline-focus">
                        <strong>Focus:</strong> {timeline.focus}
                      </p>
                      <ul className="cv-timeline-project-list">
                        {timeline.projects.map((project, j) => (
                          <li key={j}>{project}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <a href="#" className="cv-back-to-top">↑ Back to Top</a>
              </section>
            ) : null}

            {education?.length ? (
              <section className="cv-section" id="education">
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
                <a href="#" className="cv-back-to-top">↑ Back to Top</a>
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

            <DebugInfo
              loading={loading}
              error={error}
              meta={meta}
              metrics={[
                {
                  label: '💼 Roles',
                  value: roles?.length || 0
                },
                {
                  label: '🎓 Education',
                  value: education?.length || 0
                },
                {
                  label: '🏆 Badges',
                  value: badges?.length || 0
                }
              ]}
            />
          </div>
        );
      }}
    </DataProvider>
  );
}
