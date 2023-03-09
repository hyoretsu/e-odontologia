import { User } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    appointmentsStart?: number;
    appointmentsEnd?: number;
    city?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    userId: string;
}

@injectable()
export default class UpdateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ appointmentsStart, appointmentsEnd, userId, password, ...data }: IRequest): Promise<User> {
        const existingUser = await this.usersRepository.findById(userId);
        if (!existingUser) {
            throw new AppError('Este usuário não existe.');
        }

        if (
            (appointmentsStart || appointmentsEnd) &&
            (appointmentsEnd || (existingUser.appointmentsEnd as number)) <=
                (appointmentsStart || (existingUser.appointmentsStart as number))
        ) {
            throw new AppError('Horário de consultas inválido.');
        }

        if (password) password = await this.hashProvider.generateHash(password);

        const updatedUser = await this.usersRepository.update(userId, {
            ...data,
            appointmentsEnd,
            appointmentsStart,
            password,
        });

        return updatedUser;
    }
}
