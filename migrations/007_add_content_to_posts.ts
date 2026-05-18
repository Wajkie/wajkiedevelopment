import { Kysely } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const up = async (db: Kysely<any>) => {
  await db.schema
    .alterTable('posts')
    .addColumn('content', 'text')
    .execute();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const down = async (db: Kysely<any>) => {
  await db.schema
    .alterTable('posts')
    .dropColumn('content')
    .execute();
};
