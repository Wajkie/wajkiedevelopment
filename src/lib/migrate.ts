// Ladda .env.local FÖRST innan något annat
import { config } from 'dotenv';
import * as path from 'path';
config({ path: path.join(__dirname, '../../.env.local') });

// NU kan vi importera db (efter env är laddad)
import { promises as fs } from 'fs';
import { Migrator, FileMigrationProvider, MigrationResult } from 'kysely';
import { db } from './db';

// Helper to create migrator instance
const createMigrator = () => new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, '../../migrations'),
  }),
});

// Helper to log migration results
const logResults = (results: MigrationResult[] | undefined, isDown = false) => {
  results?.forEach((it) => {
    if (it.status === 'Success') {
      const action = isDown ? 'was rolled back' : 'was executed';
      console.log(`✅ Migration "${it.migrationName}" ${action} successfully`);
    } else if (it.status === 'Error') {
      const action = isDown ? 'roll back' : 'execute';
      console.error(`❌ Failed to ${action} migration "${it.migrationName}"`);
    }
  });
};

const migrateToLatest = async () => {
  const migrator = createMigrator();
  const { error, results } = await migrator.migrateToLatest();

  logResults(results, false);

  if (error) {
    console.error('❌ Failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
};

const migrateDown = async () => {
  const migrator = createMigrator();
  const { error, results } = await migrator.migrateDown();

  logResults(results, true);

  if (error) {
    console.error('❌ Failed to rollback');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
};

const command = process.argv[2];

if (command === 'up') {
  migrateToLatest();
} else if (command === 'down') {
  migrateDown();
} else {
  console.log('Usage: npm run migrate:up OR npm run migrate:down');
  process.exit(1);
}
