import { Octokit } from 'octokit';
import matter from 'gray-matter';
import type { Post, PostMetadata, GitHubFile, GitHubContent, PostFrontmatter, GitHubRepo, NpmSearchResponse, NpmPackageObject } from '@/types';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER; // t.ex. "wajkie"
const GITHUB_REPO = process.env.GITHUB_REPO;   // t.ex. "blogposts"
const NPM_USERNAME = process.env.NPM_USERNAME || GITHUB_OWNER; // Använd samma username som GitHub om inte annat anges
const CONTENT_PATH = 'content/posts';           // Sökväg i repot

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

// Hämta alla markdown-filer från GitHub
export const getAllPostsFromGitHub = async (): Promise<PostMetadata[]> => {
  if (!GITHUB_OWNER || !GITHUB_REPO) {
    console.error('GitHub credentials saknas');
    return [];
  }

  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: CONTENT_PATH,
    });

    if (!Array.isArray(data)) return [];

    const posts = await Promise.all(
      data
        .filter((file): file is GitHubFile => 
          file.type === 'file' && file.name.endsWith('.md')
        )
        .map(async (file) => {
          const slug = file.name.replace(/\.md$/, '');
          
          // Hämta filinnehåll
          if (!file.download_url) {
            throw new Error(`No download URL for ${file.name}`);
          }
          
          const contentResponse = await fetch(file.download_url, {
            next: { revalidate: 1800 } // Cache for 30 minutes
          });
          const content = await contentResponse.text();
          const { data: frontmatter } = matter(content);
          const typedFrontmatter: PostFrontmatter = frontmatter as PostFrontmatter;

          return {
            slug,
            title: typedFrontmatter.title || 'Untitled',
            date: typedFrontmatter.date || new Date().toISOString(),
            excerpt: typedFrontmatter.excerpt || '',
          };
        })
    );

    // Sortera efter datum
    return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Fel vid hämtning av posts från GitHub:', error);
    return [];
  }
};

// Hämta en specifik post från GitHub
export const getPostFromGitHub = async (slug: string): Promise<Post | null> => {
  if (!GITHUB_OWNER || !GITHUB_REPO) {
    console.error('GitHub credentials saknas');
    return null;
  }

  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: `${CONTENT_PATH}/${slug}.md`,
    });

    if (Array.isArray(data) || data.type !== 'file') return null;

    const typedData = data as GitHubContent;

    // Hämta raw content
    if (!typedData.download_url) {
      throw new Error(`No download URL for ${slug}`);
    }
    
    const contentResponse = await fetch(typedData.download_url, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    });
    const fileContent = await contentResponse.text();
    const { data: frontmatter, content } = matter(fileContent);
    const typedFrontmatter: PostFrontmatter = frontmatter as PostFrontmatter;

    return {
      slug,
      title: typedFrontmatter.title || 'Untitled',
      date: typedFrontmatter.date || new Date().toISOString(),
      excerpt: typedFrontmatter.excerpt || '',
      content,
    };
  } catch (error) {
    console.error(`Fel vid hämtning av post ${slug}:`, error);
    return null;
  }
};

// Pusha nytt inlägg till GitHub
export const pushPostToGitHub = async (
  slug: string,
  title: string,
  date: string,
  excerpt: string,
  content: string
): Promise<{ success: boolean; error?: string }> => {
  if (!GITHUB_OWNER || !GITHUB_REPO || !GITHUB_TOKEN) {
    return { success: false, error: 'GitHub credentials saknas' };
  }

  const frontmatter = `---
title: "${title}"
date: "${date}"
excerpt: "${excerpt}"
slug: "${slug}"
---

${content}`;

  try {
    // Kolla om filen redan finns
    let sha: string | undefined;
    try {
      const { data: existingFile } = await octokit.rest.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: `${CONTENT_PATH}/${slug}.md`,
      });
      if (!Array.isArray(existingFile) && existingFile.type === 'file') {
        const typedFile = existingFile as GitHubContent;
        sha = typedFile.sha;
      }
    } catch {
      // Filen finns inte, vilket är okej
    }

    // Skapa eller uppdatera filen
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: `${CONTENT_PATH}/${slug}.md`,
      message: sha ? `Update post: ${title}` : `Create post: ${title}`,
      content: Buffer.from(frontmatter).toString('base64'),
      sha,
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Fel vid push till GitHub:', error);
    return { success: false, error: errorMessage };
  }
};

// Hämta alla repos för användaren
export const getUserRepos = async (): Promise<GitHubRepo[]> => {
  if (!GITHUB_OWNER || !GITHUB_TOKEN) {
    console.error('GitHub credentials saknas');
    return [];
  }

  try {
    const { data: repos } = await octokit.rest.repos.listForUser({
      username: GITHUB_OWNER,
      per_page: 100,
      sort: 'updated',
    });

    // Kolla varje repo för workflows
    const reposWithWorkflows = await Promise.all(
      repos.map(async (repoData) => {
        let hasWorkflows = false;
        
        try {
          // Försök hämta .github/workflows mappen
          await octokit.rest.repos.getContent({
            owner: GITHUB_OWNER,
            repo: repoData.name,
            path: '.github/workflows',
          });
          hasWorkflows = true;
        } catch {
          // Mappen finns inte = inga workflows
          hasWorkflows = false;
        }

        const repo: GitHubRepo = {
          id: repoData.id,
          name: repoData.name,
          full_name: repoData.full_name,
          description: repoData.description,
          html_url: repoData.html_url,
          homepage: repoData.homepage ?? null,
          language: repoData.language ?? null,
          stargazers_count: repoData.stargazers_count ?? 0,
          forks_count: repoData.forks_count ?? 0,
          topics: repoData.topics || [],
          created_at: repoData.created_at ?? new Date().toISOString(),
          updated_at: repoData.updated_at ?? new Date().toISOString(),
          pushed_at: repoData.pushed_at ?? new Date().toISOString(),
          fork: repoData.fork ?? false,
          archived: repoData.archived ?? false,
          has_workflows: hasWorkflows,
        };
        return repo;
      })
    );

    return reposWithWorkflows;
  } catch (error) {
    console.error('Fel vid hämtning av repos:', error);
    return [];
  }
};

// Hämta senaste workflow runs för ett repo
export const getWorkflowRuns = async (repoName: string) => {
  if (!GITHUB_OWNER || !GITHUB_TOKEN) {
    return [];
  }

  try {
    const { data } = await octokit.rest.actions.listWorkflowRunsForRepo({
      owner: GITHUB_OWNER,
      repo: repoName,
      per_page: 5,
    });

    return data.workflow_runs.map(run => ({
      id: run.id,
      name: run.name ?? 'Workflow',
      status: run.status as 'queued' | 'in_progress' | 'completed',
      conclusion: run.conclusion as 'success' | 'failure' | 'cancelled' | 'skipped' | null,
      created_at: run.created_at,
      updated_at: run.updated_at,
      html_url: run.html_url,
    }));
  } catch {
    return [];
  }
};

// Hämta senaste commit för ett repo
export const getLatestCommit = async (repoName: string) => {
  if (!GITHUB_OWNER || !GITHUB_TOKEN) {
    return null;
  }

  try {
    const { data } = await octokit.rest.repos.listCommits({
      owner: GITHUB_OWNER,
      repo: repoName,
      per_page: 1,
    });

    if (data.length === 0) return null;

    const commit = data[0];
    return {
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author?.name ?? 'Unknown',
      date: commit.commit.author?.date ?? new Date().toISOString(),
      url: commit.html_url,
    };
  } catch {
    return null;
  }
};

// Hämta antal publicerade npm-paket för användaren
export const getNpmPackageCount = async (): Promise<number> => {
  if (!NPM_USERNAME) {
    return 0;
  }

  try {
    const response = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=author:${NPM_USERNAME}&size=250`,
      {
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      return 0;
    }

    const data = (await response.json()) as { total?: number };
    return data.total ?? 0;
  } catch {
    return 0;
  }
};

// Hämta alla npm-paket för användaren med fullständig information
export const getNpmPackages = async (): Promise<NpmPackageObject[]> => {
  if (!NPM_USERNAME) {
    console.error('NPM_USERNAME saknas');
    return [];
  }

  try {
    const response = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=author:${NPM_USERNAME}&size=250`,
      {
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch npm packages');
      return [];
    }

    const data: NpmSearchResponse = await response.json();
    return data.objects || [];
  } catch (error) {
    console.error('Fel vid hämtning av npm-paket:', error);
    return [];
  }
};
