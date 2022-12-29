import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';

import { AppConfig } from '../config/types';


@Injectable()
export class BotService {
  public readonly bot: TelegramBot

  constructor(private readonly config: ConfigService<AppConfig, true>) {
    this.bot = new TelegramBot(
      this.config.get('TELEGRAM_BOT_API_KEY'), 
      { 
        webHook: {
          host: this.config.get('BASE_API_HOST'),
          port: this.config.get('BASE_API_PORT'),
        }
      }
    );
  }
}
