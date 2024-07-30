import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import buildRepository from './repository';
import * as schema from './schema';
import { jsonRoute } from '@/utils/middleware';
import { TemplateNotFound } from './errors';
import { Database } from '@/database';

export default (db: Database) => {
  const router = Router();
  const repository = buildRepository(db);

  router
    .route('/')
    .get(jsonRoute(repository.findAll))
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body);

        return repository.addTemplate(body);
      }, StatusCodes.CREATED)
    );

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const record = await repository.findById(id);
        if (!record) {
          throw new TemplateNotFound();
        }
        return record;
      })
    )
    .patch(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const bodyPatch = schema.parseUpdateable(req.body);
        const record = await repository.updateTemplate(id, bodyPatch);
        if (!record) {
          throw new TemplateNotFound();
        }
        return record;
      })
    )
    .delete(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const record = await repository.removeTemplate(id);
        if (!record) {
          throw new TemplateNotFound();
        }
        return record;
      })
    );

  return router;
};
