import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot, { Message } from 'node-telegram-bot-api';

import { AppConfig } from '../config/types';

@Injectable()
export class BotService implements OnApplicationBootstrap {
  private _bot: TelegramBot;

  constructor(private readonly config: ConfigService<AppConfig, true>) {
    this._bot = new TelegramBot(this.config.get('TELEGRAM_BOT_API_KEY'), {
      polling: false,
    });
  }

  get bot(): TelegramBot {
    return this._bot;
  }

  async onApplicationBootstrap(): Promise<void> {
    this.bot.setWebHook('https://' + this.config.get('BASE_API_HOST') + '/bot');

    this.bot.on('message', (message: Message) => {
      if (message.text?.startsWith('echo ')) {
        this.bot.sendMessage(message.chat.id, message.text.split('echo ')[1]);
      }
    })
  }
}
