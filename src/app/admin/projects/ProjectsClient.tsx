'use client';

import Button from '@/components/ui/Button';
import { RepoSection } from '@/components/projects/RepoSection';
import { useProjectManager } from '@/hooks/useProjectManager';
import { cn } from '@/lib/cn';

export default function ProjectsClient() {
  const {
    repos,
    selectedIds,
    deploymentUrls,
    loading,
    saving,
    message,
    toggleRepo,
    updateDeploymentUrl,
    saveProjects,
  } = useProjectManager();

  if (loading) {
    return (
      <div className="min-h-screen dark bg-background py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <p className="text-muted-foreground">Hämtar repositories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!repos) {
    return (
      <div className="min-h-screen dark bg-background py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <p className="text-destructive">Kunde inte hämta repositories</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Hantera projekt</h1>
              <p className="text-muted-foreground mt-2">
                Välj vilka repositories som ska visas på din portfolio
              </p>
            </div>
            <Button onClick={saveProjects} disabled={saving} variant="default">
              {saving ? 'Sparar...' : `Spara val (${selectedIds.size})`}
            </Button>
          </div>
          
          {message && (
            <div
              role="alert"
              aria-live="polite"
              className={cn(
                'mt-4 rounded-lg border p-4',
                message.includes('✅')
                  ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400'
                  : 'bg-destructive/10 text-destructive border-destructive/20'
              )}
            >
              {message}
            </div>
          )}
        </div>

        {/* Med CI/CD */}
        <RepoSection
          title="🚀 Med CI/CD Pipelines"
          repos={repos.withPipelines}
          selectedIds={selectedIds}
          deploymentUrls={deploymentUrls}
          onToggle={toggleRepo}
          onUrlChange={updateDeploymentUrl}
        />

        {/* Utan CI/CD */}
        <RepoSection
          title="📦 Utan CI/CD Pipelines"
          repos={repos.withoutPipelines}
          selectedIds={selectedIds}
          deploymentUrls={deploymentUrls}
          onToggle={toggleRepo}
          onUrlChange={updateDeploymentUrl}
        />
      </div>
    </div>
  );
}
