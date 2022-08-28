import { container } from 'tsyringe';

import '@modules/users/providers';

import ObjectivesRepository from '@modules/objectives/infra/sequelize/repositories/ObjectivesRepository';
import ProgressRepository from '@modules/objectives/infra/sequelize/repositories/ProgressRepository';
import IObjectivesRepository from '@modules/objectives/repositories/IObjectivesRepository';
import IProgressRepository from '@modules/objectives/repositories/IProgressRepository';
import UsersRepository from '@modules/users/infra/sequelize/repositories/UsersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

container.registerSingleton<IObjectivesRepository>('ObjectivesRepository', ObjectivesRepository);
container.registerSingleton<IProgressRepository>('ProgressRepository', ProgressRepository);
container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository);
