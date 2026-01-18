// GitHub API response types
export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string | null;
  git_url: string | null;
  download_url: string | null;
  type: 'file' | 'dir' | 'submodule' | 'symlink';
  _links: {
    self: string;
    git: string | null;
    html: string | null;
  };
}

export interface GitHubContent {
  type: 'file' | 'dir';
  encoding?: string;
  size: number;
  name: string;
  path: string;
  content?: string;
  sha: string;
  url: string;
  git_url: string | null;
  html_url: string | null;
  download_url: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  has_workflows: boolean;
}

// Workflow and activity types
export interface GitHubWorkflowRun {
  status: string;
  conclusion: string | null;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  date: string;
  author: string;
}

export interface RepoWithActivity {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  runs: GitHubWorkflowRun[];
  commit: GitHubCommit | null;
}
