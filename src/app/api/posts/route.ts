import { NextResponse } from 'next/server';
import { pushPostToGitHub } from '@/lib/github';

interface PostBody {
  slug: string;
  title: string;
  date?: string;
  excerpt?: string;
  content: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as PostBody;
    const { slug, title, date, excerpt, content } = body;

    // Validera input
    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: 'Slug, title och content är obligatoriska' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: result.error || 'Kunde inte pusha till GitHub' },
        { status: 500 }
      );
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

    return NextResponse.json({ 
      success: true, 
      message: 'Blogginlägg pushat till GitHub och sparat i databas!',
      slug 
    });
  } catch (error) {
    console.error('Error saving post:', error);
    return NextResponse.json(
      { error: 'Kunde inte spara blogginlägg' },
      { status: 500 }
    );
  }
}
