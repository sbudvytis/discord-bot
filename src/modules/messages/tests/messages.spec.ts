import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import { omit } from 'lodash/fp';
import { messageFactory, messageMatcher } from './utils';
import createApp from '@/app';

const db = await createTestDatabase();
const app = createApp(db);

const uploadMessages = createFor(db, 'congratulatoryMessages');

afterEach(async () => {
  await db.deleteFrom('congratulatoryMessages').execute();
});

afterAll(() => db.destroy());

describe('GET', () => {
  it('should return an empty array when there are no articles', async () => {
    const { body } = await supertest(app).get('/messages').expect(200);

    expect(body).toEqual([]);
  });

  it('should return a list of existing articles', async () => {
    await uploadMessages([
      messageFactory(),

      messageFactory({
        messageText: 'message text',
        username: 'test',
        sprint: 'test-sprint',
        createdAt: 12,
      }),
    ]);

    const { body } = await supertest(app).get('/messages').expect(200);

    expect(body).toEqual([
      messageMatcher(),
      messageMatcher({
        messageText: 'message text',
        username: 'test',
        sprint: 'test-sprint',
        createdAt: 12,
      }),
    ]);
  });
});

describe('POST', () => {
  it('should return 400 if title is missing', async () => {
    await supertest(app)
      .post('/messages')
      .send(omit(['username'], messageFactory({})))
      .expect(400);
  });

  it('should return 400 if sprintCode is missing', async () => {
    await supertest(app)
      .post('/messages')
      .send(omit(['sprintCode'], messageFactory({})))
      .expect(400);
  });

  it('should return 201 and store everything into database', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({
        username: 'test',
        sprintCode: 'WD-1.24',
      })
      .expect(201);

    expect(body).toEqual({ username: 'test', sprintCode: 'WD-1.24' });
  });
});
