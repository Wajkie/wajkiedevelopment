import { CamelCasePlugin, Generated, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

// Database schema types (använd camelCase i TypeScript)
export interface Database {
  posts: PostTable;
  projects: ProjectTable;
}

export interface PostTable {
  id: Generated<number>;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface ProjectTable {
  id: Generated<number>;
  repoId: number;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  topics: string[]; // JSONB array
  hasWorkflows: boolean;
  lastCommit: Date;
  deploymentUrl: string | null;
  orderIndex: number;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

// Skapa Kysely instance med CamelCasePlugin
function createDialect() {
  const dbUrl = process.env.DATABASE_URL || '';
  
  // Neon kräver alltid SSL
  return new PostgresDialect({
    pool: new Pool({
      connectionString: dbUrl.split('?')[0],
      max: 10,
      ssl: { rejectUnauthorized: false },
    }),
  });
}

const dialect = createDialect();

export const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin()],
});
