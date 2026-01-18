import { Kysely, sql } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const up = async (db: Kysely<any>) => {
  // API Tokens tabell
  await db.schema
    .createTable('apiTokens')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('token_hash', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('allowed_domains', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('rate_limit', 'integer', (col) => col.notNull().defaultTo(100))
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('last_used_at', 'timestamp')
    .execute();

  // Page Visits tabell
  await db.schema
    .createTable('pageVisits')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('token_id', 'integer', (col) =>
      col.notNull().references('apiTokens.id').onDelete('cascade')
    )
    .addColumn('action', 'varchar(50)', (col) => col.notNull())
    .addColumn('page_path', 'text')
    .addColumn('ip_hash', 'varchar(64)', (col) => col.notNull())
    .addColumn('timestamp', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  // Indexes för snabbare queries
  await db.schema
    .createIndex('idx_api_tokens_hash')
    .on('apiTokens')
    .column('token_hash')
    .execute();

  await db.schema
    .createIndex('idx_page_visits_token_id')
    .on('pageVisits')
    .column('token_id')
    .execute();

  await db.schema
    .createIndex('idx_page_visits_timestamp')
    .on('pageVisits')
    .columns(['token_id', 'timestamp'])
    .execute();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable('pageVisits').ifExists().execute();
  await db.schema.dropTable('apiTokens').ifExists().execute();
};
