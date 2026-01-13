import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
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
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
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
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('projects').ifExists().execute();
}
