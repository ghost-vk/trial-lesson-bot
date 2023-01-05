import { Module } from '@nestjs/common';

import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { StepService } from './step.service';
import { UserService } from './user.service';

@Module({
  providers: [BotService, UserService, StepService],
  controllers: [BotController],
})
export class BotModule {}
