export interface AppConfig {
  NODE_ENV: string;
  APPLICATION_PORT: number;
  APPLICATION_HOST: string;
  LOGGER_BOOL: boolean;
  PRISMA_LOGGER_LEVELS_ARRAY: string[];
  DATABASE_URL: string;
  TELEGRAM_BOT_API_KEY: string;
  BASE_API_HOST: string;
  BASE_API_PORT?: number;
}

export type EnvBoolean = "y" | "n";

export interface EnvVariables {
  NODE_ENV: string;
  APPLICATION_PORT: number;
  APPLICATION_HOST: string;
  LOGGER: EnvBoolean;
  PRISMA_LOGGER_LEVELS: string;
  DATABASE_URL: string;
  TELEGRAM_BOT_API_KEY: string;
  BASE_API_HOST: string;
  BASE_API_PORT: number;
}
