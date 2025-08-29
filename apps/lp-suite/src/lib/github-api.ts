// GitHub API クライアント
import { PR_AUTOMATION_CONSTANTS } from './constants/pr-automation-constants';

export class GitHubAPIClient {
  private token: string;
  private owner: string;
  private repo: string;
  
  constructor(config: { token: string; owner: string; repo: string }) {
    this.token = config.token;
    this.owner = config.owner;
    this.repo = config.repo;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${PR_AUTOMATION_CONSTANTS.GITHUB_API.BASE_URL}/repos/${this.owner}/${this.repo}/${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': PR_AUTOMATION_CONSTANTS.GITHUB_API.ACCEPT_HEADER,
        'Content-Type': PR_AUTOMATION_CONSTANTS.GITHUB_API.CONTENT_TYPE,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${PR_AUTOMATION_CONSTANTS.ERROR_MESSAGES.GITHUB_API_ERROR}: ${error.message}`);
    }

    return response.json();
  }

  async createBranch(branchName: string, baseBranch: string = PR_AUTOMATION_CONSTANTS.DEFAULT_CONFIG.BASE_BRANCH): Promise<any> {
    const baseRef = await this.getBranch(baseBranch);
    
    return this.makeRequest('git/refs', {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: baseRef.commit.sha,
      }),
    });
  }

  async getBranch(branchName: string): Promise<any> {
    return this.makeRequest(`branches/${branchName}`);
  }

  async createPR(prData: {
    title: string;
    body: string;
    head: string;
    base: string;
  }): Promise<any> {
    return this.makeRequest('pulls', {
      method: 'POST',
      body: JSON.stringify(prData),
    });
  }

  async getFile(path: string, ref: string = PR_AUTOMATION_CONSTANTS.DEFAULT_CONFIG.BASE_BRANCH): Promise<any> {
    return this.makeRequest(`contents/${path}?ref=${ref}`);
  }

  async updateFile(fileData: {
    path: string;
    message: string;
    content: string;
    sha: string;
    branch?: string;
  }): Promise<any> {
    const endpoint = `contents/${fileData.path}`;
    
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify({
        message: fileData.message,
        content: fileData.content,
        sha: fileData.sha,
        branch: fileData.branch || PR_AUTOMATION_CONSTANTS.DEFAULT_CONFIG.BASE_BRANCH,
      }),
    });
  }
}