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

// Frontmatter interface
export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt?: string;
  slug?: string;
}

// Post interfaces
export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

// GitHub Repository types
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
  has_workflows: boolean; // Har GitHub Actions/CI/CD
}

export interface SelectedProject {
  repoId: number;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  topics: string[];
  hasWorkflows: boolean;
  lastCommit: string; // pushed_at från GitHub
  deploymentUrl: string | null; // Custom deployment URL
  order: number;
}
