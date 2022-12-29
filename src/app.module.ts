import { Module } from '@nestjs/common';

import { BotModule } from './modules/bot/bot.module';
import { AppConfigModule } from './modules/config/config.module';
import { AppLoggerModule } from './modules/logger/appLogger.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [AppConfigModule, AppLoggerModule, PrismaModule, BotModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
