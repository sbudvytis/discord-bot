import { expect } from 'vitest';
import type { Insertable } from 'kysely';
import type { Sprints } from '@/database';

/**
 * Generates a fake article with some default data for inserting it to the database.
 * Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article.
 * @returns an article that can be inserted into the database.
 */
export const sprintFactory = (
  overrides: Partial<Insertable<Sprints>> = {}
): Insertable<Sprints> => ({
  sprintCode: 'WD-24.24',
  title: 'Testing test',
  ...overrides,
});

/**
 * Generates a fake areticle with some default data. Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article.
 * @returns an article with all fields.
 */
export const sprintFactoryFull = (
  overrides: Partial<Insertable<Sprints>> = {}
): Insertable<Sprints> => ({
  ...sprintFactory(overrides),
});

/**
 * Generates a matcher for an article. Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article matcher.
 * @returns a matcher that can be used to compare an article from the database.
 */
export const sprintMatcher = (
  overrides: Partial<Insertable<Sprints>> = {}
) => ({
  id: expect.any(Number),
  ...overrides,
  ...sprintFactory(overrides),
});
