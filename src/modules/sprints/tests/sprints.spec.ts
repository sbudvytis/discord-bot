import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import { sprintFactory, sprintMatcher } from './utils';
import createApp from '@/app';

const db = await createTestDatabase();
const app = createApp(db);

const createSprints = createFor(db, 'sprints');

afterEach(async () => {
  await db.deleteFrom('sprints').execute();
});

afterAll(() => db.destroy());

describe('GET', () => {
  it('should return an empty array when there are no sprints', async () => {
    const { body } = await supertest(app).get('/sprints').expect(200);

    expect(body).toEqual([]);
  });

  it('should return a list of existing sprints', async () => {
    await createSprints([
      sprintFactory(),

      sprintFactory({
        sprintCode: 'WD-24.24',
        title: 'Testing test',
      }),
    ]);

    const { body } = await supertest(app).get('/sprints').expect(200);

    expect(body).toEqual([
      sprintMatcher(),
      sprintMatcher({
        sprintCode: 'WD-24.24',
        title: 'Testing test',
      }),
    ]);
  });
});

describe('GET /:id', () => {
  it('should return 404 if sprint does not exist', async () => {
    const response = await supertest(app).get('/sprints/2912').expect(404);
    const contentType = response.headers['content-type'];

    if (contentType.includes('text/html')) {
      const bodyText = response.text;
      expect(bodyText).toMatch(/not found/i);
    }
  });

  it('should return a sprint if it exists', async () => {
    await createSprints([
      sprintFactory({
        id: 1371,
        sprintCode: 'WD-24.24',
        title: 'Testing test',
      }),
    ]);

    const { body } = await supertest(app).get('/sprints/1371').expect(200);

    expect(body).toEqual(
      sprintMatcher({
        id: 1371,
      })
    );
  });
});

describe('POST', () => {
  it('should return 201 and store everything into database', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send({
        sprintCode: 'WD-24.24',
        title: 'Testing test',
      })
      .expect(201);

    expect(body).toEqual({
      id: expect.any(Number),
      sprintCode: 'WD-24.24',
      title: 'Testing test',
    });
  });
});
