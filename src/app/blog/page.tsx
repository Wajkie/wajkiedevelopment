import Link from 'next/link';
import { db } from '@/lib/db';

// Revalidera var 60:e sekund (ISR)
export const revalidate = 60;

export default async function BlogPage() {
  // Hämta posts från databasen (snabbt!)
  const posts = await db
    .selectFrom('posts')
    .selectAll()
    .orderBy('date', 'desc')
    .execute();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Min blogg</h1>
          <Link 
            href="/admin"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Nytt inlägg
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">Inga blogginlägg än.</p>
            <Link 
              href="/admin"
              className="text-blue-600 hover:underline"
            >
              Skapa ditt första inlägg →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article 
                key={post.slug}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold mb-2 hover:text-blue-600">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm mb-3">
                    {new Date(post.date).toLocaleDateString('sv-SE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {post.excerpt && (
                    <p className="text-gray-700 mb-4">{post.excerpt}</p>
                  )}
                  <span className="text-blue-600 hover:underline">
                    Läs mer →
                  </span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
