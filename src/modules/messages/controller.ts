import { Router, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import discordBot from '@/modules/messages/discordBot';
import buildRepository from './repository';
import { jsonRoute } from '@/utils/middleware';
import { MessageNotFound } from './errors';
import BadRequest from '@/utils/errors/BadRequest';
import { Database } from '@/database';

export default (db: Database) => {
  const router = Router();
  const repository = buildRepository(db);

  router.route('/').post(
    jsonRoute(async (req: Request) => {
      const { username, sprintCode } = req.body;

      if (!username) {
        throw new BadRequest('Please provide a username');
      } else if (!sprintCode) {
        throw new BadRequest('Please provide a sprint code');
      }

      discordBot.handleAccomplishmentTrigger(username, sprintCode);

      return { username, sprintCode };
    }, StatusCodes.CREATED)
  );

  router.route('/').get(
    jsonRoute(async (req) => {
      if (req.query.username) {
        const username = req.query.username as string;
        const messages = await repository.getMessagesByUser(username);

        if (!messages) {
          throw new MessageNotFound();
        }

        return messages;
      }
      if (req.query.sprint) {
        const sprint = req.query.sprint as string;
        const messages = await repository.getMessagesBySprint(sprint);

        if (!messages) {
          throw new MessageNotFound();
        }

        return messages;
      }
      const messages = await repository.findAll();

      if (!messages) {
        throw new MessageNotFound();
      }

      return messages;
    })
  );

  return router;
};
