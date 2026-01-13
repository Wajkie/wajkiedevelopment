import { CamelCasePlugin, Generated, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

// Database schema types (använd camelCase i TypeScript)
export interface Database {
  posts: PostTable;
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

// Skapa Kysely instance med CamelCasePlugin
const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin()],
});
