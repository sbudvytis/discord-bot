import type { ColumnType } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface CongratulatoryMessages {
  createdAt: Generated<number>;
  id: Generated<number>;
  messageText: string;
  sprint: string;
  username: string;
}

export interface MessageTemplates {
  id: Generated<number>;
  templateText: string;
}

export interface Sprints {
  id: Generated<number>;
  sprintCode: string;
  title: string;
}

export interface DB {
  congratulatoryMessages: CongratulatoryMessages;
  messageTemplates: MessageTemplates;
  sprints: Sprints;
}
