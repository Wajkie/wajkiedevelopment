import { Octokit } from 'octokit';
import matter from 'gray-matter';
import type { Post, PostMetadata, GitHubFile, GitHubContent, PostFrontmatter } from '@/types';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER; // t.ex. "wajkie"
const GITHUB_REPO = process.env.GITHUB_REPO;   // t.ex. "blogposts"
const CONTENT_PATH = 'content/posts';           // Sökväg i repot

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

// Hämta alla markdown-filer från GitHub
export async function getAllPostsFromGitHub(): Promise<PostMetadata[]> {
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
          
          const contentResponse = await fetch(file.download_url);
          const content = await contentResponse.text();
          const { data: frontmatter } = matter(content);
          const typedFrontmatter = frontmatter as PostFrontmatter;

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
}

// Hämta en specifik post från GitHub
export async function getPostFromGitHub(slug: string): Promise<Post | null> {
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
    
    const contentResponse = await fetch(typedData.download_url);
    const fileContent = await contentResponse.text();
    const { data: frontmatter, content } = matter(fileContent);
    const typedFrontmatter = frontmatter as PostFrontmatter;

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
}

// Pusha nytt inlägg till GitHub
export async function pushPostToGitHub(
  slug: string,
  title: string,
  date: string,
  excerpt: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
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
}
