import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { stdTimeFunctions } from 'pino';

import { AppConfig } from '../config/types';
import { preparePinoMultistream } from './functions';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: async (configService: ConfigService<AppConfig, true>) => ({
        pinoHttp: [
          {
            level: configService.get('LOGGER') ? 'debug' : 'info',
            redact: ['req.headers.cookie', 'req.headers.authorization'],
            timestamp: stdTimeFunctions.isoTime,
          },
          preparePinoMultistream(configService.get('LOGGER')),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppLoggerModule {}
