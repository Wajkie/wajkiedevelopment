import { config } from 'dotenv';
import * as path from 'path';
config({ path: path.join(__dirname, '../.env.local') });

import { db } from '../src/lib/db';

const slug = 'fran-github-till-databas';
const title = 'Från GitHub till databas – hur jag fixade min bloggarkitektur';
const date = '2026-05-13';
const excerpt = 'Hur ett utgånget GitHub-token avslöjade ett arkitekturproblem, och hur vi löste det genom att göra databasen till enda källan till sanning.';
const content = `
Nyligen stötte jag på ett irriterande problem: mina blogginlägg hade försvunnit. Eller, rättare sagt – de syntes inte längre på sidan. Det visade sig vara symptom på ett djupare arkitekturproblem som jag inte ens visste att jag hade.

## Problemet

Appen var uppdelad i två separata flöden:

- **Blogglistan** (\`/blog\`) hämtade metadata från **databasen**
- **Enskilda inlägg** (\`/blog/[slug]\`) hämtade innehåll från **GitHub**

Det innebar att ett inlägg behövde existera på *två* ställen för att fungera – i databasen och i GitHub-repot. Dessutom hade skapandet av nya inlägg ett skörönt webhookflöde: admin-sidan pushade till GitHub, anropade sedan en webhook mot sig självt för att spara metadata i databasen. Om webhooken misslyckades saknades inlägget i listan.

Den direkta orsaken till att inläggen försvann? Ett utgånget GitHub-token – men det avslöjade att arkitekturen aldrig var robust från början.

## Lösningen

Vi bestämde oss för att göra databasen till **enda källan till sanning** (single source of truth).

### 1. Ny databaskolumn

Posttabellen saknade en \`content\`-kolumn – den lagrade bara metadata. Vi lade till den via en ny migration:

\`\`\`ts
export const up = async (db: Kysely<any>) => {
  await db.schema
    .alterTable('posts')
    .addColumn('content', 'text')
    .execute();
};
\`\`\`

### 2. Seeda från GitHub

För att migrera befintliga inlägg skrev vi ett seedskript som hämtar alla markdown-filer från GitHub-repot och sparar dem i databasen – inklusive innehållet:

\`\`\`bash
npm run seed:posts
\`\`\`

### 3. Konsekvent datahämtning

Båda sidorna läser nu från databasen:

\`\`\`ts
// /blog/[slug]/page.tsx
const post = await db
  .selectFrom('posts')
  .selectAll()
  .where('slug', '=', slug)
  .executeTakeFirst();
\`\`\`

### 4. Förenklat skrivflöde

\`createPost\` sparar nu direkt i databasen och pushar till GitHub som backup – utan webhook:

\`\`\`ts
await db.insertInto('posts')
  .values({ slug, title, excerpt, content, date, updatedAt: new Date() })
  .onConflict((oc) => oc.column('slug').doUpdateSet({ ... }))
  .execute();

// GitHub som backup (icke-fatal om det misslyckas)
try {
  await pushPostToGitHub(slug, title, date, excerpt, content);
} catch (err) {
  console.error('GitHub backup misslyckades:', err);
}
\`\`\`

## Bonus: Turbopack-cache

Under processen slutade plötsligt *alla* routes utom startsidan att fungera och returnerade 404. Orsaken visade sig vara en korrupt Turbopack-cache. Lösningen:

\`\`\`bash
rm -rf .next
npm run dev
\`\`\`

## Lärdomar

- **Dela aldrig upp samma data mellan två system** utan en tydlig synkroniseringsstrategi
- Webhooks mot sig själv är sprödare än direkta databasanrop
- En utgången token kan avslöja arkitekturproblem som legat och slumrat
- Rensa \`.next\` när Turbopack beter sig konstigt
`.trim();

const run = async () => {
  await db
    .insertInto('posts')
    .values({ slug, title, excerpt, content, date, updatedAt: new Date() })
    .onConflict((oc) =>
      oc.column('slug').doUpdateSet({ title, excerpt, content, date, updatedAt: new Date() })
    )
    .execute();

  console.log(`✅ Post "${title}" sparad`);
  console.log(`   → http://localhost:3000/blog/${slug}`);
  await db.destroy();
};

run().catch((err) => {
  console.error('❌ Misslyckades:', err);
  process.exit(1);
});
