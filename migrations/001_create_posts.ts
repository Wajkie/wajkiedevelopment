import { Kysely, sql } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const up = async (db: Kysely<any>) => {
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
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
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
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable('posts').ifExists().execute();
};
