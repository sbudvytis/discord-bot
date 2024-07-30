import { expect } from 'vitest';
import type { Insertable } from 'kysely';
import type {
  CongratulatoryMessages,
  Sprints,
  MessageTemplates,
} from '@/database';

/**
 * Generates a fake article with some default data for inserting it to the database.
 * Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article.
 * @returns an article that can be inserted into the database.
 */
export const messageFactory = (
  overrides: Partial<Insertable<CongratulatoryMessages>> = {}
): Insertable<CongratulatoryMessages> => ({
  messageText: 'Test text',
  sprint: 'test-sprint',
  username: 'test',
  createdAt: 12,
  ...overrides,
});

export const sprintFactory = (
  overrides: Partial<Insertable<Sprints>> = {}
): Insertable<Sprints> => ({
  title: 'test-sprint',
  sprintCode: 'test',
  ...overrides,
});

export const templateFactory = (
  overrides: Partial<Insertable<MessageTemplates>> = {}
): Insertable<MessageTemplates> => ({
  templateText: 'random text',
  ...overrides,
});

/**
 * Generates a fake areticle with some default data. Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article.
 * @returns an article with all fields.
 */
export const messageFactoryFull = (
  overrides: Partial<Insertable<CongratulatoryMessages>> = {}
): Insertable<CongratulatoryMessages> => ({
  ...messageFactory(overrides),
});

/**
 * Generates a matcher for an article. Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article matcher.
 * @returns a matcher that can be used to compare an article from the database.
 */
export const messageMatcher = (
  overrides: Partial<Insertable<CongratulatoryMessages>> = {}
) => ({
  id: expect.any(Number),
  ...overrides,
  ...messageFactory(overrides),
});
