import { useState, useEffect } from 'react';
import type { GitHubRepo, SelectedProject } from '@/types';
import { getProjects, getRepos, saveProjects as saveProjectsAction } from '@/lib/actions/projects';

interface RepoLists {
  withPipelines: GitHubRepo[];
  withoutPipelines: GitHubRepo[];
}

export const useProjectManager = () => {
  const [repos, setRepos] = useState<RepoLists | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deploymentUrls, setDeploymentUrls] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [reposData, projectsData] = await Promise.all([
          getRepos(),
          getProjects(),
        ]);

        setRepos(reposData);
        setSelectedIds(new Set(projectsData.map((p) => p.repoId)));
        setDeploymentUrls(
          new Map(projectsData.map((p) => [p.repoId, p.deploymentUrl || '']))
        );
      } catch (error) {
        console.error('Fel vid hämtning:', error);
        setMessage('❌ Kunde inte hämta data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const toggleRepo = (repoId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(repoId)) {
        next.delete(repoId);
      } else {
        next.add(repoId);
      }
      return next;
    });
  };

  const updateDeploymentUrl = (repoId: number, url: string) => {
    setDeploymentUrls((prev) => new Map(prev).set(repoId, url));
  };

  const saveProjects = async () => {
    if (!repos) return;

    setSaving(true);
    setMessage('');

    const allRepos = [...repos.withPipelines, ...repos.withoutPipelines];
    const projects: SelectedProject[] = Array.from(selectedIds)
      .map((id, index) => {
        const repo = allRepos.find((r) => r.id === id);
        if (!repo) return null;

        return {
          repoId: repo.id,
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          homepage: repo.homepage,
          language: repo.language,
          stars: repo.stargazers_count,
          topics: repo.topics,
          hasWorkflows: repo.has_workflows,
          lastCommit: repo.pushed_at,
          deploymentUrl: deploymentUrls.get(id) || null,
          order: index,
        };
      })
      .filter((p): p is SelectedProject => p !== null);

    try {
      await saveProjectsAction(projects);
      setMessage('✅ Projekt sparade!');
    } catch (error) {
      console.error('Fel vid sparande:', error);
      setMessage('❌ Kunde inte spara');
    } finally {
      setSaving(false);
    }
  };

  return {
    repos,
    selectedIds,
    deploymentUrls,
    loading,
    saving,
    message,
    toggleRepo,
    updateDeploymentUrl,
    saveProjects,
  };
};
