import { z } from 'zod';
import type { CongratulatoryMessages } from '@/database';

// validation schema
type Record = CongratulatoryMessages;
const schema = z.object({
  id: z.coerce.number().int().positive(),

  messageText: z.string().min(1).max(500),

  sprint: z.string().min(1).max(100),

  username: z.string().min(1).max(100),

  createdAt: z.coerce.number().int().positive(),
});

const insertable = schema.omit({
  id: true,
});
const partial = insertable.partial();

export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseUser = (username: unknown) =>
  schema.shape.username.parse(username);
export const parse = (record: unknown) => schema.parse(record);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parsePartial = (record: unknown) => partial.parse(record);

// matches database and validation schema keys
export const keys: (keyof Record)[] = Object.keys(schema.shape).map(
  (key) => key as string
) as (keyof z.infer<typeof schema>)[];
