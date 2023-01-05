import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { BotModule } from './modules/bot/bot.module';
import { AppConfigModule } from './modules/config/config.module';
import { AppLoggerModule } from './modules/logger/appLogger.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [AppConfigModule, AppLoggerModule, PrismaModule, BotModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
