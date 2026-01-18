// Project types
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
  lastCommit: string;
  deploymentUrl: string | null;
  order: number;
}
