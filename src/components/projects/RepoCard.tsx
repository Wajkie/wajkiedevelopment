import { cn } from '@/lib/cn';
import type { GitHubRepo } from '@/types';

interface RepoCardProps {
  repo: GitHubRepo;
  isSelected: boolean;
  deploymentUrl: string;
  onToggle: () => void;
  onUrlChange: (url: string) => void;
}

export const RepoCard = ({ repo, isSelected, deploymentUrl, onToggle, onUrlChange }: RepoCardProps) => {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-all',
        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-card'
      )}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="mt-1 h-4 w-4 rounded border-input cursor-pointer"
          aria-label={`Välj ${repo.name}`}
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{repo.name}</h3>
          
          {repo.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{repo.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-2">
            {repo.language && (
              <Badge variant="accent">{repo.language}</Badge>
            )}
            {repo.stargazers_count > 0 && (
              <Badge variant="accent">⭐ {repo.stargazers_count}</Badge>
            )}
            {repo.topics.slice(0, 3).map((topic) => (
              <Badge key={topic} variant="secondary">{topic}</Badge>
            ))}
          </div>

          {isSelected && (
            <div className="mt-3 pt-3 border-t border-border">
              <label htmlFor={`deploy-${repo.id}`} className="text-sm font-medium block mb-1">
                Deployment URL (valfritt)
              </label>
              <input
                id={`deploy-${repo.id}`}
                type="url"
                value={deploymentUrl}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder="https://example.vercel.app"
                className={cn(
                  'flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                  'ring-offset-background placeholder:text-muted-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Badge = ({ variant, children }: { variant: 'accent' | 'secondary'; children: React.ReactNode }) => {
  return (
    <span
      className={cn(
        'text-xs px-2 py-1 rounded-md',
        variant === 'accent' && 'bg-accent text-accent-foreground',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground'
      )}
    >
      {children}
    </span>
  );
};
