import { Kysely, sql } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const up = async (db: Kysely<any>) => {
  // Skapa projects tabell
  await db.schema
    .createTable('projects')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('repo_id', 'integer', (col) => col.notNull().unique())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('url', 'text', (col) => col.notNull())
    .addColumn('homepage', 'text')
    .addColumn('language', 'varchar(100)')
    .addColumn('stars', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('topics', 'jsonb', (col) => col.notNull().defaultTo(sql`'[]'::jsonb`))
    .addColumn('has_workflows', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('last_commit', 'timestamp', (col) => col.notNull())
    .addColumn('deployment_url', 'text')
    .addColumn('order_index', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  // Index för snabbare queries
  await db.schema
    .createIndex('idx_projects_repo_id')
    .ifNotExists()
    .on('projects')
    .column('repo_id')
    .execute();

  await db.schema
    .createIndex('idx_projects_order')
    .ifNotExists()
    .on('projects')
    .column('order_index')
    .execute();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable('projects').ifExists().execute();
};
