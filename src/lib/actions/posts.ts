'use server';

import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { pushPostToGitHub } from '@/lib/github';
import { redirect } from 'next/navigation';

export async function createPost(formData: {
  slug: string;
  title: string;
  date?: string;
  excerpt?: string;
  content: string;
}) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect('/auth/signin');
  }

  const { slug, title, content } = formData;
  const date = formData.date || new Date().toISOString().split('T')[0];
  const excerpt = formData.excerpt || '';

  if (!slug || !title || !content) {
    throw new Error('Slug, title och content är obligatoriska');
  }

  // Save to DB (source of truth)
  await db
    .insertInto('posts')
    .values({ slug, title, excerpt, content, date, updatedAt: new Date() })
    .onConflict((oc) =>
      oc.column('slug').doUpdateSet({ title, excerpt, content, date, updatedAt: new Date() })
    )
    .execute();

  // Push to GitHub as backup (non-fatal if it fails)
  try {
    await pushPostToGitHub(slug, title, date, excerpt, content);
  } catch (err) {
    console.error('GitHub backup push misslyckades:', err);
  }

  return { success: true, slug };
}
