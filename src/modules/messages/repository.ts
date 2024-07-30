import { Insertable, Selectable, sql } from 'kysely';
import { keys } from './schema';
import type { CongratulatoryMessages, Database } from '@/database';

const TABLE = 'congratulatoryMessages';
type Row = CongratulatoryMessages;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export default (db: Database) => ({
  saveMessageToDatabase(record: RowInsert): Promise<RowSelect | undefined> {
    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst();
  },

  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).execute();
  },

  // gets all messages where specific user has been mentioned
  getMessagesByUser(username: string): Promise<RowSelect[]> {
    return db
      .selectFrom(TABLE)
      .selectAll()
      .where('username', '=', username)
      .execute();
  },

  // gets all messages by specific sprint
  getMessagesBySprint(sprintCode: string): Promise<RowSelect[]> {
    return db
      .selectFrom(TABLE)
      .innerJoin('sprints', 'sprint', 'sprints.title')
      .where('sprints.sprintCode', '=', sprintCode)
      .selectAll('congratulatoryMessages')
      .execute();
  },

  // finds sprint's title using sprint code
  async getTitleBySprintCode(sprintCode: string): Promise<string | undefined> {
    const result = await db
      .selectFrom('sprints')
      .select('title')
      .where('sprintCode', '=', sprintCode)
      .execute();

    return result[0]?.title;
  },

  // retrieves random congratulatory message
  async getRandomMessageTemplate(): Promise<string | undefined> {
    const result = await db
      .selectFrom('messageTemplates')
      .select('templateText')
      .orderBy(sql`RANDOM()`)
      .limit(1)
      .execute();

    return result[0]?.templateText;
  },
});
