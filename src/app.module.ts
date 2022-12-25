import { Module } from '@nestjs/common';

import { AppConfigModule } from './modules/config/config.module';
import { AppController } from './modules/example/app.controller';
import { AppService } from './modules/example/app.service';
import { AppLoggerModule } from './modules/logger/appLogger.module';

@Module({
  imports: [AppConfigModule, AppLoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
