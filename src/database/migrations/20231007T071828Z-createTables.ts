import { Kysely, SqliteDatabase, sql } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('congratulatory_messages')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().autoIncrement().notNull()
    )
    .addColumn('message_text', 'text', (column) => column.notNull())
    .addColumn('username', 'text', (column) => column.notNull())
    .addColumn('sprint', 'text', (column) => column.notNull())
    .addColumn('created_at', 'datetime', (column) =>
      column.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();

  await db.schema
    .createTable('message_templates')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().autoIncrement().notNull()
    )
    .addColumn('template_text', 'text', (column) => column.notNull())
    .execute();

  await db.schema
    .createTable('sprints')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().autoIncrement().notNull()
    )
    .addColumn('sprint_code', 'text', (column) => column.notNull())
    .addColumn('title', 'text', (column) => column.notNull())
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('congratulatory_messages').execute();
  await db.schema.dropTable('message_templates').execute();
  await db.schema.dropTable('sprints').execute();
}
