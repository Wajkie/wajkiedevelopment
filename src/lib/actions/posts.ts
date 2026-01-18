'use server';

import { getSession } from '@/lib/auth';
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

  const { slug, title, date, excerpt, content } = formData;

  // Validera input
  if (!slug || !title || !content) {
    throw new Error('Slug, title och content är obligatoriska');
  }

  // Pusha till GitHub
  const result = await pushPostToGitHub(
    slug,
    title,
    date || new Date().toISOString().split('T')[0],
    excerpt || '',
    content
  );

  if (!result.success) {
    throw new Error(result.error || 'Kunde inte pusha till GitHub');
  }

  // Anropa webhook för att spara metadata i databasen
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    
    await fetch(`${baseUrl}/api/webhook/post-published`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        title,
        excerpt: excerpt || '',
        date: date || new Date().toISOString().split('T')[0],
      }),
    });
  } catch (webhookError) {
    console.error('Webhook call failed:', webhookError);
    // Fortsätt ändå - GitHub push lyckades
  }

  return { 
    success: true, 
    message: 'Blogginlägg pushat till GitHub och sparat i databas!',
    slug 
  };
}
