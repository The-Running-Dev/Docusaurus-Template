import React from 'react';

import { useGitHubConfig } from '../../config/GitHubConfig/useGitHubConfig';
import { GitHubInfoProps } from '../../config/GitHubConfig/models';

const GitHubInfo: React.FC<GitHubInfoProps> = ({ className }) => {
  const config = useGitHubConfig();

  return (
    <div className={`github-info ${className || ''}`}>
      <h3>📱 GitHub Configuration</h3>

      <div className="config-section">
        <h4>Repository Info</h4>
        <ul>
          <li>
            <strong>Repository:</strong> {config.repo}
          </li>
          <li>
            <strong>Organization:</strong> {config.organization}
          </li>
          <li>
            <strong>Project:</strong> {config.project}
          </li>
          <li>
            <strong>Description:</strong> {config.metadata.description}
          </li>
          <li>
            <strong>License:</strong> {config.metadata.license}
          </li>
        </ul>
      </div>

      <div className="config-section">
        <h4>Topics</h4>
        <div className="topics">
          {config.metadata.topics.map((topic, index) => (
            <span
              key={index}
              className="topic-badge"
              style={{
                background: 'var(--ifm-color-primary-lighter)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.8em',
                margin: '2px'
              }}
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div className="config-section">
        <h4>Quick Links</h4>
        <ul>
          <li>
            <a
              href={config.urls.repository}
              target="_blank"
              rel="noopener noreferrer"
            >
              🏠 Repository
            </a>
          </li>
          <li>
            <a
              href={config.urls.issues}
              target="_blank"
              rel="noopener noreferrer"
            >
              🐛 Issues
            </a>
          </li>
          <li>
            <a
              href={config.urls.discussions}
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Discussions
            </a>
          </li>
          <li>
            <a
              href={config.urls.releases}
              target="_blank"
              rel="noopener noreferrer"
            >
              🚀 Releases
            </a>
          </li>
        </ul>
      </div>

      {config.features && (
        <div className="config-section">
          <h4>Feature Flags</h4>
          <ul>
            <li>
              Issue Links: {config.features.enableIssueLinks ? '✅' : '❌'}
            </li>
            <li>
              Contributor Links:{' '}
              {config.features.enableContributorLinks ? '✅' : '❌'}
            </li>
            <li>
              Release Notes: {config.features.enableReleaseNotes ? '✅' : '❌'}
            </li>
            <li>Branch Info: {config.features.showBranchInfo ? '✅' : '❌'}</li>
          </ul>
        </div>
      )}

      {config.integrations?.githubActions && (
        <div className="config-section">
          <h4>GitHub Actions</h4>
          <ul>
            <li>
              Enabled: {config.integrations.githubActions.enabled ? '✅' : '❌'}
            </li>
            {config.integrations.githubActions.workflows && (
              <li>
                Workflows:{' '}
                {config.integrations.githubActions.workflows.join(', ')}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GitHubInfo;
