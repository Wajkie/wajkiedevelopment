import { db } from '@/lib/db';
import type { SelectedProject } from '@/types';
import { Card, CardContent } from '@/components/ui';
import { PageContainer, PageHeader } from '@/components/layout';
import { ProjectCard } from '@/components/common';
import { getTranslations } from '@/lib/i18n/server';

export default async function ProjectsPage() {
  const tr = await getTranslations();

  const dbProjects = await db
    .selectFrom('projects')
    .selectAll()
    .orderBy('orderIndex', 'asc')
    .execute();

  const projects: SelectedProject[] = dbProjects.map(p => ({
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
  }));

  return (
    <PageContainer>
      <PageHeader
        title={tr.projects.title}
        description={tr.projects.description}
      />

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              {tr.projects.noProjects}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.repoId} project={project} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
