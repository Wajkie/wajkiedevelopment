import { RepoCard } from './RepoCard';
import type { GitHubRepo } from '@/types';

interface RepoSectionProps {
  title: string;
  repos: GitHubRepo[];
  selectedIds: Set<number>;
  deploymentUrls: Map<number, string>;
  onToggle: (id: number) => void;
  onUrlChange: (id: number, url: string) => void;
}

export function RepoSection({ title, repos, selectedIds, deploymentUrls, onToggle, onUrlChange }: RepoSectionProps) {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground">({repos.length})</span>
      </div>
      
      {repos.length === 0 ? (
        <p className="text-muted-foreground">Inga repositories</p>
      ) : (
        <div className="grid gap-3">
          {repos.map((repo) => (
            <RepoCard
              key={repo.id}
              repo={repo}
              isSelected={selectedIds.has(repo.id)}
              deploymentUrl={deploymentUrls.get(repo.id) || ''}
              onToggle={() => onToggle(repo.id)}
              onUrlChange={(url) => onUrlChange(repo.id, url)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
