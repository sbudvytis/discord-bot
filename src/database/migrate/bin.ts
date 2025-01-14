/* eslint-disable no-console */
import 'dotenv/config';
import * as path from 'path';
import SQLite, { type Database } from 'better-sqlite3';
import fs from 'fs/promises';
import { Kysely, Migrator, SqliteDialect, FileMigrationProvider } from 'kysely';

const { DATABASE_URL } = process.env;
const MIGRATIONS_PATH = '../migrations';

export async function migrateToLatest() {
  if (typeof DATABASE_URL !== 'string') {
    throw new Error('Provide DATABASE_URL in your env variables.');
  }

  const db = new Kysely<Database>({
    dialect: new SqliteDialect({
      database: new SQLite(DATABASE_URL),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, MIGRATIONS_PATH),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed succesfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();
