import { expect } from 'vitest';
import type { Insertable } from 'kysely';
import type { MessageTemplates } from '@/database';

/**
 * Generates a fake article with some default data for inserting it to the database.
 * Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article.
 * @returns an article that can be inserted into the database.
 */
export const templateFactory = (
  overrides: Partial<Insertable<MessageTemplates>> = {}
): Insertable<MessageTemplates> => ({
  templateText: 'Testing template text',
  ...overrides,
});

/**
 * Generates a fake areticle with some default data. Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article.
 * @returns an article with all fields.
 */
export const templateFactoryFull = (
  overrides: Partial<Insertable<MessageTemplates>> = {}
): Insertable<MessageTemplates> => ({
  ...templateFactory(overrides),
});

/**
 * Generates a matcher for an article. Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article matcher.
 * @returns a matcher that can be used to compare an article from the database.
 */
export const templateMatcher = (
  overrides: Partial<Insertable<MessageTemplates>> = {}
) => ({
  id: expect.any(Number),
  ...overrides,
  ...templateFactory(overrides),
});
