import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { BotService } from './bot.service';

@Controller()
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post(`/bot`)
  async handleTelegramWebhook(@Req() req: Request, @Res() res: Response): Promise<void> {
    this.botService.bot.processUpdate(req.body);
    res.sendStatus(200);
  }
}
