import { createFor, selectAllFor } from '@tests/utils/records';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { templateFactory, templateMatcher } from './utils';
import buildRepository from '../repository';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createTemplates = createFor(db, 'messageTemplates');
const selectTemplates = selectAllFor(db, 'messageTemplates');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('messageTemplates').execute();
});

describe('addTemplate', () => {
  it('should create a template explicitly listing all fields', async () => {
    const savedTemplates = await repository.addTemplate({
      templateText: 'Testing template text',
    });

    expect(savedTemplates).toEqual({
      id: 1,
      templateText: 'Testing template text',
    });

    const templatesInDatabase = await selectTemplates();
    expect(templatesInDatabase).toEqual([savedTemplates]);
  });
});

describe('getAllMessages', () => {
  it('should return all templates', async () => {
    await createTemplates([
      templateFactory({
        templateText: 'Testing template text',
      }),
      templateFactory({
        templateText: 'Testing template text 2x',
      }),
    ]);

    const messages = await repository.findAll();

    expect(messages).toHaveLength(2);
    expect(messages[0]).toEqual(
      templateMatcher({
        templateText: 'Testing template text',
      })
    );
    expect(messages[1]).toEqual(
      templateMatcher({
        templateText: 'Testing template text 2x',
      })
    );
  });
});

describe('findById', () => {
  it('should return a template by id', async () => {
    const [template] = await createTemplates(
      templateFactory({
        id: 123,
      })
    );

    const foundTemplate = await repository.findById(template!.id);

    expect(foundTemplate).toEqual(templateMatcher());
  });

  it('should return undefined if sprint is not found', async () => {
    const foundTemplate = await repository.findById(123123);

    expect(foundTemplate).toBeUndefined();
  });
});

describe('updateTemplate', () => {
  it('should update the template message', async () => {
    const [template] = await createTemplates(templateFactory());

    const updatedSprint = await repository.updateTemplate(template.id, {
      templateText: 'Updated template text',
    });

    expect(updatedSprint).toMatchObject(
      templateMatcher({
        templateText: 'Updated template text',
      })
    );
  });

  it('should return the original template text if no changes were made', async () => {
    const [template] = await createTemplates(templateFactory());

    const updatedTemplate = await repository.updateTemplate(template.id, {});

    expect(updatedTemplate).toMatchObject(templateMatcher());
  });

  it('should return undefined if template message is not found', async () => {
    const updatedTemplate = await repository.updateTemplate(123, {
      templateText: 'Updated template text',
    });
    expect(updatedTemplate).toBeUndefined();
  });
});

describe('removeTemplate', () => {
  it('should remove a template text', async () => {
    const [template] = await createTemplates(templateFactory());

    const removedTemplate = await repository.removeTemplate(template.id);

    expect(removedTemplate).toEqual(templateMatcher());
  });

  it('should return undefined if template text is not found', async () => {
    const removedTemplate = await repository.removeTemplate(123);

    expect(removedTemplate).toBeUndefined();
  });
});
