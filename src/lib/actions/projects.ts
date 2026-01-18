'use server';

import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { getUserRepos } from '@/lib/github';
import { redirect } from 'next/navigation';
import type { SelectedProject } from '@/types';

// Helper function to transform DB project to API format
// jscpd:ignore-start
const dbProjectToSelected = (p: {
  repoId: number;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  topics: string[];
  hasWorkflows: boolean;
  lastCommit: Date;
  deploymentUrl: string | null;
  orderIndex: number;
}): SelectedProject => ({
  repoId: p.repoId,
  name: p.name,
  description: p.description,
  url: p.url,
  homepage: p.homepage,
  language: p.language,
  stars: p.stars,
  topics: p.topics,
  hasWorkflows: p.hasWorkflows,
  lastCommit: p.lastCommit.toISOString(),
  deploymentUrl: p.deploymentUrl,
  order: p.orderIndex,
});

// Helper function to transform API project to DB format
const selectedToDbProject = (p: SelectedProject) => ({
  repoId: p.repoId,
  name: p.name,
  description: p.description,
  url: p.url,
  homepage: p.homepage,
  language: p.language,
  stars: p.stars,
  topics: p.topics,
  hasWorkflows: p.hasWorkflows,
  lastCommit: new Date(p.lastCommit),
  deploymentUrl: p.deploymentUrl,
  orderIndex: p.order,
});
// jscpd:ignore-end

export async function getProjects() {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  const dbProjects = await db
    .selectFrom('projects')
    .selectAll()
    .orderBy('orderIndex', 'asc')
    .execute();

  const projects: SelectedProject[] = dbProjects.map(dbProjectToSelected);

  return projects;
}

export async function saveProjects(projects: SelectedProject[]) {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  // Ta bort alla befintliga projekt
  await db.deleteFrom('projects').execute();

  // Sätt in nya projekt
  if (projects.length > 0) {
    await db
      .insertInto('projects')
      .values(projects.map(selectedToDbProject))
      .execute();
  }
  
  return { success: true };
}

export async function getRepos() {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  const repos = await getUserRepos();
  
  // Dela upp i två listor
  const withPipelines = repos.filter(repo => repo.has_workflows && !repo.fork && !repo.archived);
  const withoutPipelines = repos.filter(repo => !repo.has_workflows && !repo.fork && !repo.archived);

  return {
    withPipelines,
    withoutPipelines,
  };
}
