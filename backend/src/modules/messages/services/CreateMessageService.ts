import { Message } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import IContentsRepository from '@modules/contents/repositories/IContentsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import { io } from '@shared/infra/http/server';

import ICreateMessageDTO from '../dtos/ICreateMessageDTO';
import IMessagesRepository from '../repositories/IMessagesRepository';

interface IRequest extends ICreateMessageDTO {
  socketId: string;
}

@injectable()
export default class CreateMessageService {
  constructor(
    @inject('MessagesRepository')
    private messagesRepository: IMessagesRepository,

    @inject('ContentsRepository')
    private contentsRepository: IContentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ body, recipientId, senderId }: IRequest): Promise<Message> {
    if (body === '') {
      throw new AppError('Please, send a message body.');
    }

    const sender = await this.usersRepository.findById(senderId);
    if (!sender) {
      throw new AppError("The given sender doesn't exist.");
    }

    const recipient = await this.usersRepository.findById(recipientId);
    if (!recipient) {
      throw new AppError("The given recipient doesn't exist.");
    }

    const message = await this.messagesRepository.create({ body, recipientId, senderId });

    io.emit('chat');

    const foundContent = await this.contentsRepository.findByTitle(body);
    if (foundContent) {
      const answers = foundContent.messages.map(msg => msg.body);

      answers.forEach(async (answer, i) => {
        await new Promise(res => {
          setTimeout(res, 2000 * (i + 1));
        });

        await this.messagesRepository.create({
          body: answer,
          recipientId: senderId,
          senderId: recipientId,
        });

        io.emit('chat');
      });
    }

    return message;
  }
}
