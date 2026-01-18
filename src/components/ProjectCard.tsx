'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ProjectCardProps {
  project: {
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
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <Card className="group hover:border-primary/50 transition-all flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="group-hover:text-primary transition-colors">
            {project.name}
          </CardTitle>
          {project.hasWorkflows && (
            <span 
              className="text-xs px-2 py-1 rounded-md bg-accent/10 text-accent border border-accent/20 shrink-0"
              aria-label="CI/CD aktiverad"
            >
              🚀 CI/CD
            </span>
          )}
        </div>
        {project.description && (
          <div>
            {showFullDescription && (
              <CardDescription className="mb-2">
                {project.description}
              </CardDescription>
            )}
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-xs text-primary hover:text-accent transition-colors underline"
            >
              {showFullDescription ? 'Dölj beskrivning' : 'Se beskrivning'}
            </button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        {/* Metadata */}
        <div className="flex flex-wrap gap-2 min-h-[28px]">
          {project.language && (
            <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
              {project.language}
            </span>
          )}
          {project.stars > 0 && (
            <span className="text-xs px-2 py-1 rounded-md bg-accent/10 text-accent border border-accent/20">
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
        <p className="text-xs text-muted-foreground">
          Senast uppdaterad:{' '}
          <time dateTime={project.lastCommit}>
            {new Date(project.lastCommit).toLocaleDateString('sv-SE', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-4">
        <div className="flex gap-2 w-full">
          <Button 
            asChild 
            variant="outline" 
            size="sm" 
            className="flex-1"
          >
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visa ${project.name} på GitHub`}
            >
              GitHub →
            </a>
          </Button>
          {(project.deploymentUrl || project.homepage) && (
            <Button 
              asChild 
              size="sm" 
              className="flex-1"
            >
              <a
                href={project.deploymentUrl || project.homepage || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Besök live demo av ${project.name}`}
              >
                Live Demo →
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
