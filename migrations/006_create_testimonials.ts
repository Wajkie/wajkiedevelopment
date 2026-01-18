import { Kysely, sql } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const up = async (db: Kysely<any>) => {
  // Skapa testimonials tabell
  await db.schema
    .createTable('testimonials')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name_hash', 'varchar(255)', (col) => col.notNull())
    .addColumn('email_hash', 'varchar(255)', (col) => col.notNull())
    .addColumn('message', 'text', (col) => col.notNull())
    .addColumn('status', 'varchar(20)', (col) => col.notNull().defaultTo('pending'))
    .addColumn('email_consent', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('thank_you_sent', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('approved_at', 'timestamp')
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  // Index för snabbare queries på status
  await db.schema
    .createIndex('idx_testimonials_status')
    .ifNotExists()
    .on('testimonials')
    .column('status')
    .execute();

  // Index för sortering på created_at
  await db.schema
    .createIndex('idx_testimonials_created_at')
    .ifNotExists()
    .on('testimonials')
    .column('created_at')
    .execute();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable('testimonials').ifExists().execute();
};
