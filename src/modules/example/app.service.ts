import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfig } from '../config/types';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService<AppConfig, true>) {}

  getHello(): string {
    const nodeEnv = this.config.get('NODE_ENV', { infer: true });

    return `Hello nestjs-core-template! Mode: ${nodeEnv}`;
  }
}
