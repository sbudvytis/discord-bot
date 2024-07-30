import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import { templateFactory, templateMatcher } from './utils';
import createApp from '@/app';

const db = await createTestDatabase();
const app = createApp(db);

const createTemplates = createFor(db, 'messageTemplates');

afterEach(async () => {
  await db.deleteFrom('messageTemplates').execute();
});

afterAll(() => db.destroy());

describe('GET', () => {
  it('should return an empty array when there are no template messages', async () => {
    const { body } = await supertest(app).get('/templates').expect(200);

    expect(body).toEqual([]);
  });

  it('should return a list of existing template mesages', async () => {
    await createTemplates([
      templateFactory(),

      templateFactory({
        templateText: 'Testing template text',
      }),
    ]);

    const { body } = await supertest(app).get('/templates').expect(200);

    expect(body).toEqual([
      templateMatcher(),
      templateMatcher({
        templateText: 'Testing template text',
      }),
    ]);
  });
});

describe('GET /:id', () => {
  it('should return 404 if template message does not exist', async () => {
    const response = await supertest(app).get('/templates/2912').expect(404);
    const contentType = response.headers['content-type'];

    if (contentType.includes('text/html')) {
      const bodyText = response.text;
      expect(bodyText).toMatch(/not found/i);
    }
  });

  it('should return a template message if it exists', async () => {
    // ARRANGE (Given that we have...)
    await createTemplates([
      templateFactory({
        id: 1371,
        templateText: 'Testing template text',
      }),
    ]);

    const { body } = await supertest(app).get('/templates/1371').expect(200);

    expect(body).toEqual(
      templateMatcher({
        id: 1371,
      })
    );
  });
});

describe('POST', () => {
  it('should return 201 and store everything into database', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send({
        templateText: 'Testing template text',
      })
      .expect(201);

    expect(body).toEqual({
      id: expect.any(Number),
      templateText: 'Testing template text',
    });
  });
});
