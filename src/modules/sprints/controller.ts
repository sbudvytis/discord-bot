import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import buildRepository from './repository';
import { jsonRoute } from '@/utils/middleware';
import * as schema from './schema';
import { SprintNotFound } from './errors';
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

        return repository.addSprint(body);
      }, StatusCodes.CREATED)
    );

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const record = await repository.findById(id);
        if (!record) {
          throw new SprintNotFound();
        }
        return record;
      })
    )
    .patch(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const bodyPatch = schema.parseUpdateable(req.body);
        const record = await repository.updateSprint(id, bodyPatch);
        if (!record) {
          throw new SprintNotFound();
        }
        return record;
      })
    )
    .delete(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const record = await repository.removeSprint(id);
        if (!record) {
          throw new SprintNotFound();
        }
        return record;
      })
    );

  return router;
};
