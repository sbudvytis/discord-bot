import { createFor, selectAllFor } from '@tests/utils/records';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { sprintFactory, sprintMatcher } from './utils';
import buildRepository from '../repository';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createSprints = createFor(db, 'sprints');
const selectSprints = selectAllFor(db, 'sprints');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('sprints').execute();
});

describe('addSprint', () => {
  it('should create a sprint explicitly listing all fields', async () => {
    const savedSprints = await repository.addSprint({
      sprintCode: 'WD-24.24',
      title: 'Testing test',
    });

    expect(savedSprints).toEqual({
      id: 1,
      sprintCode: 'WD-24.24',
      title: 'Testing test',
    });

    const messagesInDatabase = await selectSprints();
    expect(messagesInDatabase).toEqual([savedSprints]);
  });
});

describe('getAllMessages', () => {
  it('should return all sprints', async () => {
    await createSprints([
      sprintFactory({
        sprintCode: 'WD-24.24',
        title: 'Testing test',
      }),
      sprintFactory({
        sprintCode: 'WD-34.34',
        title: 'Testing tests test',
      }),
    ]);

    const messages = await repository.findAll();

    expect(messages).toHaveLength(2);
    expect(messages[0]).toEqual(
      sprintMatcher({
        sprintCode: 'WD-24.24',
        title: 'Testing test',
      })
    );
    expect(messages[1]).toEqual(
      sprintMatcher({
        sprintCode: 'WD-34.34',
        title: 'Testing tests test',
      })
    );
  });
});

describe('findById', () => {
  it('should return a sprint by id', async () => {
    const [sprint] = await createSprints(
      sprintFactory({
        id: 123,
      })
    );

    const foundSprint = await repository.findById(sprint!.id);

    expect(foundSprint).toEqual(sprintMatcher());
  });

  it('should return undefined if sprint is not found', async () => {
    const foundSprint = await repository.findById(123123);

    expect(foundSprint).toBeUndefined();
  });
});

describe('updateSprint', () => {
  it('should update sprint', async () => {
    const [sprint] = await createSprints(sprintFactory());

    const updatedSprint = await repository.updateSprint(sprint.id, {
      sprintCode: 'WD-123',
      title: 'Updated sprint',
    });

    expect(updatedSprint).toMatchObject(
      sprintMatcher({
        sprintCode: 'WD-123',
        title: 'Updated sprint',
      })
    );
  });

  it('should return the original sprint if no changes were made', async () => {
    const [sprint] = await createSprints(sprintFactory());

    const updatedSprint = await repository.updateSprint(sprint.id, {});

    expect(updatedSprint).toMatchObject(sprintMatcher());
  });

  it('should return undefined if sprint is not found', async () => {
    const updatedSprint = await repository.updateSprint(123, {
      title: 'Updated sprint',
    });
    expect(updatedSprint).toBeUndefined();
  });
});

describe('removeSprint', () => {
  it('should remove a sprint', async () => {
    const [sprint] = await createSprints(sprintFactory());

    const removedSprint = await repository.removeSprint(sprint.id);

    expect(removedSprint).toEqual(sprintMatcher());
  });

  it('should return undefined if article is not found', async () => {
    const removedSprint = await repository.removeSprint(123);

    expect(removedSprint).toBeUndefined();
  });
});
