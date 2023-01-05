import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot, { Message } from 'node-telegram-bot-api';

import { AppConfig } from '../config/types';
import { StepService } from './step.service';
import { UserService } from './user.service';

@Injectable()
export class BotService implements OnApplicationBootstrap {
  private _bot: TelegramBot;

  constructor(
    private readonly config: ConfigService<AppConfig, true>,
    private readonly userService: UserService,
    private readonly stepService: StepService,
  ) {
    this._bot = new TelegramBot(this.config.get('TELEGRAM_BOT_API_KEY'), {
      polling: false,
    });
    this.stepService.bot = this._bot;
  }

  get bot(): TelegramBot {
    return this._bot;
  }

  async onApplicationBootstrap(): Promise<void> {
    this.bot.setWebHook('https://' + this.config.get('BASE_API_HOST') + '/bot');

    this.bot.on('message', async (message: Message) => {
      const user = await this.userService.createUserIfNotExist(message);

      await this.stepService.makeFirstStep(user);
    });

    this.bot.on('callback_query', async (query) => {
      await this.stepService.handleButton(query);
    })
  }
}
