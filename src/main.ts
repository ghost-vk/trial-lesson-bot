import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { AppConfig } from './modules/config/types';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService<AppConfig, true>>(ConfigService);
  const logger = app.get<Logger>(Logger);
  const port = config.get('APPLICATION_PORT', { infer: true });

  await app.listen(port);
  logger.log(`⚡️ Application started successfully on port ${port}`);
}

bootstrap();
