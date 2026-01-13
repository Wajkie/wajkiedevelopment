import { db } from '@/lib/db';
import type { SelectedProject } from '@/types';

export default async function ProjectsPage() {
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
    <div className="min-h-screen dark bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Mina projekt
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            En samling av mina bästa arbeten och open source-projekt
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Inga projekt att visa än
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <article
                key={project.repoId}
                className="bg-card border rounded-lg p-6 hover:border-primary/50 transition-all hover:shadow-lg group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.name}
                  </h2>
                  {project.hasWorkflows && (
                    <span 
                      className="text-xs px-2 py-1 rounded-md bg-green-500/10 text-green-600 border border-green-500/20 dark:text-green-400"
                      title="CI/CD Pipeline"
                    >
                      🚀 CI/CD
                    </span>
                  )}
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {project.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.language && (
                    <span className="text-xs px-2 py-1 rounded-md bg-accent text-accent-foreground">
                      {project.language}
                    </span>
                  )}
                  {project.stars > 0 && (
                    <span className="text-xs px-2 py-1 rounded-md bg-accent text-accent-foreground">
                      ⭐ {project.stars}
                    </span>
                  )}
                  {project.topics.slice(0, 2).map(topic => (
                    <span 
                      key={topic} 
                      className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Last Updated */}
                <p className="text-xs text-muted-foreground mb-4">
                  Senast uppdaterad:{' '}
                  {new Date(project.lastCommit).toLocaleDateString('sv-SE', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>

                {/* Links */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-9 px-3 flex-1"
                  >
                    GitHub →
                  </a>
                  {(project.deploymentUrl || project.homepage) && (
                    <a
                      href={project.deploymentUrl || project.homepage || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 flex-1"
                    >
                      Live Demo →
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
