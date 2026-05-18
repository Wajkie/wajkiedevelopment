import { config } from 'dotenv';
import * as path from 'path';
config({ path: path.join(__dirname, '../.env.local') });

import matter from 'gray-matter';
import { db } from '../src/lib/db';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER!;
const GITHUB_REPO = process.env.GITHUB_REPO!;
const CONTENT_PATH = 'content/posts';

interface GitHubFile {
  type: string;
  name: string;
  download_url: string | null;
}

const ghFetch = (url: string) =>
  fetch(url, {
    headers: {
      ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
      Accept: 'application/vnd.github+json',
    },
  });

const seed = async () => {
  if (!GITHUB_OWNER || !GITHUB_REPO) {
    console.error('❌ GitHub credentials saknas i .env.local');
    process.exit(1);
  }

  console.log(`Hämtar posts från github.com/${GITHUB_OWNER}/${GITHUB_REPO}/${CONTENT_PATH} ...`);

  const res = await ghFetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_PATH}`
  );

  if (!res.ok) {
    console.error(`❌ GitHub API svarade med ${res.status}: ${await res.text()}`);
    process.exit(1);
  }

  const files = (await res.json()) as GitHubFile[];

  if (!Array.isArray(files)) {
    console.error('❌ Förväntade en lista av filer men fick något annat');
    process.exit(1);
  }

  const mdFiles = files.filter((f) => f.type === 'file' && f.name.endsWith('.md'));
  console.log(`Hittade ${mdFiles.length} markdown-filer`);

  for (const file of mdFiles) {
    const slug = file.name.replace(/\.md$/, '');

    if (!file.download_url) {
      console.warn(`⚠️  Ingen download_url för ${file.name}, hoppar över`);
      continue;
    }

    const raw = await (await fetch(file.download_url)).text();
    const { data: frontmatter, content } = matter(raw);

    const title = (frontmatter.title as string) || 'Untitled';
    const excerpt = (frontmatter.excerpt as string) || '';
    const date = (frontmatter.date as string) || new Date().toISOString().split('T')[0];

    await db
      .insertInto('posts')
      .values({ slug, title, excerpt, content, date, updatedAt: new Date() })
      .onConflict((oc) =>
        oc.column('slug').doUpdateSet({ title, excerpt, content, date, updatedAt: new Date() })
      )
      .execute();

    console.log(`✅ ${slug}`);
  }

  console.log('Seeding klar!');
  await db.destroy();
};

seed().catch((err) => {
  console.error('❌ Seeding misslyckades:', err);
  process.exit(1);
});
