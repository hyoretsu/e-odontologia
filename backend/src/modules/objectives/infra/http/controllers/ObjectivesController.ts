import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateObjectiveService from '@modules/objectives/services/CreateObjectiveService';
import ListObjectivesService from '@modules/objectives/services/ListObjectivesService';

export default class ObjectivesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { body } = req;

    const createObjective = container.resolve(CreateObjectiveService);

    const objective = await createObjective.execute(body);

    return res.json(objective);
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const listObjectives = container.resolve(ListObjectivesService);

    const objectives = await listObjectives.execute();

    return res.json(objectives);
  }
}