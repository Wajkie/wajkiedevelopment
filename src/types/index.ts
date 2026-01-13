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
