import { Octokit } from '@octokit/rest';
import { IRepoProvider, RepoStats, IConfigService } from '../repositories/interfaces';

/**
 * GitHub implementation of the repository provider
 */
export class GitHubRepoProvider implements IRepoProvider {
  private octokit: Octokit;
  private lastRequest = 0;

  constructor(private readonly config: IConfigService) {
    this.octokit = new Octokit({ auth: config.getGitHubToken() });
  }

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const diff = now - this.lastRequest;
    if (diff < 1000) {
      await new Promise((res) => setTimeout(res, 1000 - diff));
    }
    this.lastRequest = Date.now();
  }

  async getRepoStats(url: string): Promise<RepoStats> {
    await this.rateLimit();
    const match = /github\.com[/:](?<owner>[^/]+)\/(?<repo>[^/]+?)(?:\.git)?$/.exec(url);
    if (!match || !match.groups) {
      throw new Error('Invalid GitHub repository URL');
    }
    const { owner, repo } = match.groups;

    const repoData = await this.octokit.repos.get({ owner, repo });
    const commitData = await this.octokit.repos.listCommits({ owner, repo, per_page: 1 });

    return {
      stars: repoData.data.stargazers_count,
      forks: repoData.data.forks_count,
      language: repoData.data.language ?? 'unknown',
      size: repoData.data.size,
      lastCommit: commitData.data[0]
        ? new Date(commitData.data[0].commit.author?.date || new Date().toISOString())
        : new Date(),
      openIssues: repoData.data.open_issues_count ?? 0
    };
  }
}
