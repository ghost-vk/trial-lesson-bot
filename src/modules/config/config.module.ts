import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { loadConfig, validationEnvSchema } from './functions';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadConfig],
      isGlobal: true,
      cache: true,
      validationSchema: validationEnvSchema,
    }),
  ],
})
export class AppConfigModule {}
