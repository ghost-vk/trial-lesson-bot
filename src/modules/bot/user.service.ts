import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Message } from 'node-telegram-bot-api';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserIfNotExist(message: Message): Promise<User> {
    const existUser = await this.prisma.user.findUnique({
      where: { telegram_id: message.chat.id },
    });

    if (existUser) {
      if (existUser.first_name && message.chat.first_name !== existUser.first_name) {
        await this.prisma.user.update({
          where: { user_id: existUser.user_id },
          data: { first_name: message.chat.first_name },
        });
      }

      return existUser;
    }

    return this.prisma.user.create({
      data: {
        telegram_id: message.chat.id,
        first_name: message.chat.first_name ? message.chat.first_name : null,
      },
    });
  }
}
