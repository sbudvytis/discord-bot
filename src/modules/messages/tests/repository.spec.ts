import { createFor, selectAllFor } from '@tests/utils/records';
import createTestDatabase from '@tests/utils/createTestDatabase';
import {
  messageFactory,
  messageMatcher,
  sprintFactory,
  templateFactory,
} from './utils';
import buildRepository from '../repository';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createMessages = createFor(db, 'congratulatoryMessages');
const createSprints = createFor(db, 'sprints');
const createRandomTemplates = createFor(db, 'messageTemplates');
const selectMessages = selectAllFor(db, 'congratulatoryMessages');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('congratulatoryMessages').execute();
});

describe('saveMessageToDatabase', () => {
  it('should upload a message explicitly listing all fields', async () => {
    // ACT (When we call...)
    const savedMessages = await repository.saveMessageToDatabase({
      messageText: 'message text',
      username: 'test',
      sprint: 'test-sprint',
      createdAt: 1,
    });

    expect(savedMessages).toEqual({
      id: expect.any(Number),
      messageText: 'message text',
      username: 'test',
      sprint: 'test-sprint',
      createdAt: 1,
    });

    const messagesInDatabase = await selectMessages();
    expect(messagesInDatabase).toEqual([savedMessages]);
  });
});

describe('getAllMessages', () => {
  it('should return all messages', async () => {
    await createMessages([
      messageFactory({
        messageText: 'Test text',
        sprint: 'test-sprint',
        username: 'test',
        createdAt: 12,
      }),
      messageFactory({
        messageText: 'Test text 2',
        sprint: 'test-sprint 2',
        username: 'test 2',
        createdAt: 14,
      }),
    ]);

    const messages = await repository.findAll();

    expect(messages).toHaveLength(2);
    expect(messages[0]).toEqual(
      messageMatcher({
        messageText: 'Test text',
        sprint: 'test-sprint',
        username: 'test',
        createdAt: 12,
      })
    );
    expect(messages[1]).toEqual(
      messageMatcher({
        messageText: 'Test text 2',
        sprint: 'test-sprint 2',
        username: 'test 2',
        createdAt: 14,
      })
    );
  });
});

describe('getMessagesByUser', () => {
  it('should return a message by user', async () => {
    const [message] = await createMessages(
      messageFactory({
        username: 'test',
      })
    );

    const foundMessage = await repository.getMessagesByUser(message!.username);

    expect(foundMessage).toEqual([messageMatcher()]);
  });
});

describe('getMessagesBySprint', () => {
  it('should return a message by sprint', async () => {
    const [sprint] = await createSprints(
      sprintFactory({
        sprintCode: 'test',
      })
    );

    const [message] = await createMessages(
      messageFactory({
        sprint: sprint.title,
      })
    );

    const foundMessages = await repository.getMessagesBySprint(
      sprint.sprintCode
    );

    expect(foundMessages).toEqual([messageMatcher(message)]);
  });
});

describe('getTitleBySprintCode', () => {
  it('should return the title of a sprint by sprint code', async () => {
    const [sprint] = await createSprints(
      sprintFactory({
        sprintCode: 'test',
        title: 'test-sprint',
      })
    );

    const foundTitle = await repository.getTitleBySprintCode(
      sprint!.sprintCode
    );

    expect(foundTitle).toEqual(sprint.title);
  });
});

describe('getRandomMessageTemplate', () => {
  it('should return a random message template', async () => {
    const createdTemplates = await createRandomTemplates([
      templateFactory({ templateText: 'random text 1' }),
      templateFactory({ templateText: 'random text 2' }),
      templateFactory({ templateText: 'random text 3' }),
    ]);

    const randomTemplate = await repository.getRandomMessageTemplate();

    expect(randomTemplate).toBeDefined();
    expect(createdTemplates.map((t) => t.templateText)).toContain(
      randomTemplate
    );
  });
});
