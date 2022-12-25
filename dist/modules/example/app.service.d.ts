import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/types';
export declare class AppService {
    private readonly config;
    constructor(config: ConfigService<AppConfig, true>);
    getHello(): string;
}
