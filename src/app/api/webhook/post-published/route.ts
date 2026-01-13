import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface WebhookBody {
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as WebhookBody;
    const { slug, title, excerpt, date } = body;

    // Validera input
    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Slug och title är obligatoriska' },
        { status: 400 }
      );
    }

    // Spara eller uppdatera i databasen
    await db
      .insertInto('posts')
      .values({
        slug,
        title,
        excerpt: excerpt || '',
        date: date || new Date().toISOString().split('T')[0],
        updatedAt: new Date(),
      })
      .onConflict((oc) =>
        oc.column('slug').doUpdateSet({
          title,
          excerpt: excerpt || '',
          date: date || new Date().toISOString().split('T')[0],
          updatedAt: new Date(),
        })
      )
      .execute();

    return NextResponse.json({
      success: true,
      message: 'Post metadata sparad i databas',
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Kunde inte spara i databas' },
      { status: 500 }
    );
  }
}
