import { ConfigService } from '@nestjs/config';
import { AppConfig } from './modules/config/types';
export declare class AppService {
  private readonly config;
  constructor(config: ConfigService<AppConfig, true>);
  getHello(): string;
}
