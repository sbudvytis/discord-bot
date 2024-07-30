import { z } from 'zod';
import type { Sprints } from '@/database';

// validation schema
type Record = Sprints;
const schema = z.object({
  id: z.coerce.number().int().positive(),

  sprintCode: z.string().min(1).max(100),

  title: z.string().min(1).max(100),
});

const insertable = schema.omit({
  id: true,
});
const partial = insertable.partial();
const updateable = insertable.partial();

export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parse = (record: unknown) => schema.parse(record);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parsePartial = (record: unknown) => partial.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);

// matches database and validation schema keys
export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
