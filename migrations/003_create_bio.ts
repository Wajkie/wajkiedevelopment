import { Kysely, sql } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable('bio')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('tagline', 'text', (col) => col.notNull())
    .addColumn('short_pitch', 'text', (col) => col.notNull())
    .addColumn('about_paragraphs', 'jsonb', (col) => col.notNull())
    .addColumn('contact_email', 'text', (col) => col.notNull())
    .addColumn('contact_github', 'text', (col) => col.notNull())
    .addColumn('contact_linkedin', 'text', (col) => col.notNull())
    .addColumn('skills_frontend', 'jsonb', (col) => col.notNull())
    .addColumn('skills_backend', 'jsonb', (col) => col.notNull())
    .addColumn('skills_tools', 'jsonb', (col) => col.notNull())
    .addColumn('values', 'jsonb', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  // Insert default data
  await db
    .insertInto('bio')
    .values({
      name: 'Fredrik Wiking',
      tagline: 'Fullstack Developer & Open Source Enthusiast',
      short_pitch:
        'Jag bygger moderna webbapplikationer med fokus på användarvänlighet, prestanda och ren kod.',
      about_paragraphs: JSON.stringify([
        'Hej! Jag är en passionerad utvecklare som älskar att skapa lösningar som gör skillnad. Med en stark grund i både frontend och backend skapar jag kompletta applikationer från ide till produktion.',
        'Mitt fokus ligger på att skriva ren, underhållbar kod och att alltid lära mig nya teknologier. Jag tror på att dela med sig av kunskap genom open source och tekniska blogginlägg.',
        'När jag inte kodar hittar du mig antingen i naturen eller experimenterande med nya verktyg och ramverk.',
      ]),
      contact_email: 'wikingfredrik@gmail.com',
      contact_github: 'https://github.com/wajkie',
      contact_linkedin: 'https://linkedin.com/in/fredrik-wiking',
      skills_frontend: JSON.stringify([
        { name: 'React', icon: '⚛️', color: 'blue' },
        { name: 'Next.js', icon: '▲', color: 'slate' },
        { name: 'TypeScript', icon: 'TS', color: 'blue' },
        { name: 'Tailwind CSS', icon: '💨', color: 'cyan' },
        { name: 'HTML/CSS', icon: '🎨', color: 'orange' },
      ]),
      skills_backend: JSON.stringify([
        { name: 'Node.js', icon: '🟢', color: 'green' },
        { name: 'PostgreSQL', icon: '🐘', color: 'blue' },
        { name: 'Kysely', icon: '🔍', color: 'purple' },
        { name: 'REST APIs', icon: '🔌', color: 'indigo' },
        { name: 'GraphQL', icon: '◈', color: 'pink' },
      ]),
      skills_tools: JSON.stringify([
        { name: 'Git', icon: '📦', color: 'orange' },
        { name: 'Docker', icon: '🐳', color: 'blue' },
        { name: 'VS Code', icon: '💻', color: 'blue' },
        { name: 'Vercel', icon: '▲', color: 'slate' },
        { name: 'npm', icon: '📦', color: 'red' },
      ]),
      values: JSON.stringify([
        {
          title: 'Clean Code',
          description: 'Läsbar, underhållbar kod som andra utvecklare förstår',
          icon: '✨',
        },
        {
          title: 'Accessibility',
          description: 'Webb för alla - WCAG 2.1 AA-standard i fokus',
          icon: '♿',
        },
        {
          title: 'Performance',
          description: 'Snabba laddningstider och optimerad användarupplevelse',
          icon: '⚡',
        },
        {
          title: 'Continuous Learning',
          description: 'Alltid nyfiken på nya teknologier och best practices',
          icon: '📚',
        },
      ]),
    })
    .execute();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable('bio').ifExists().execute();
};
