import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  // Skapa posts tabell
  await db.schema
    .createTable('posts')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('slug', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('excerpt', 'text')
    .addColumn('date', 'date', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .execute();

  // Index för snabbare queries
  await db.schema
    .createIndex('idx_posts_date')
    .ifNotExists()
    .on('posts')
    .column('date')
    .execute();

  await db.schema
    .createIndex('idx_posts_slug')
    .ifNotExists()
    .on('posts')
    .column('slug')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('posts').ifExists().execute();
}
