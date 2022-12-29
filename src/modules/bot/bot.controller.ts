import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { BotService } from './bot.service';

@Controller('webhoook')
export class BotController {
  constructor(private readonly bot: BotService) {}

  @Post('t')
  async handleTelegramWebhook(@Req() req: Request, @Res() res: Response): Promise<void> {
    const { message } = req.body;

    console.log(JSON.stringify(message, null, 2));

    res.status(200);
  }
}
