import Joi from 'joi';

import { AppConfig, EnvVariables } from './types';

/**
 * Возвращает boolean значение по правилу:
 * 'y' => true
 * 'n' => false
 * Если значение не удовлетворяет условиям отображения, функция возвращает false
 *
 * @example
 * // returns true
 * convertEnvToBoolean('y')
 *
 * @example
 * // returns false
 * convertEnvToBoolean('n')
 *
 * @example
 * // returns false
 * convertEnvToBoolean(null)
 */
export const convertEnvToBoolean = (env: string | undefined): boolean => {
  return env ? env === 'y' : false;
};

export const availableEnvBoolean = ['y', 'n'];

export const loadConfig = (): AppConfig => ({
  NODE_ENV: process.env.NODE_ENV as string,
  APPLICATION_PORT: +(process.env.APPLICATION_PORT as string),
  APPLICATION_HOST: process.env.APPLICATION_HOST as string,
  LOGGER: convertEnvToBoolean(process.env.LOGGER),
  DATABASE_URL: process.env.DATABASE_URL as string,
  PRISMA_LOGGER_LEVELS: process.env.PRISMA_LOGGER_LEVELS as string,
  TELEGRAM_BOT_API_KEY: process.env.TELEGRAM_BOT_API_KEY as string,
  BASE_API_HOST: process.env.BASE_API_HOST as string,
  BASE_API_PORT: +(process.env.BASE_API_PORT as string) || undefined,
});

export const getTelegramBotApiKey = (): string => {
  return process.env.TELEGRAM_BOT_API_KEY as string;
}

export const validationEnvSchema = Joi.object<EnvVariables, true>({
  NODE_ENV: Joi.string().required().valid('production', 'development').label('NODE_ENV'),
  APPLICATION_PORT: Joi.number().required().label('APPLICATION_PORT'),
  APPLICATION_HOST: Joi.string().required().label('APPLICATION_HOST'),
  LOGGER: Joi.string()
    .required()
    .valid(...availableEnvBoolean)
    .label('LOGGER'),
  DATABASE_URL: Joi.string().required().label('DATABASE_URL'),
  PRISMA_LOGGER_LEVELS: Joi.string().optional().default('').label('PRISMA_LOGGER_LEVELS'),
  TELEGRAM_BOT_API_KEY: Joi.string().required().label('TELEGRAM_BOT_API_KEY'),
  BASE_API_HOST: Joi.string().required().label('BASE_API_HOST'),
  BASE_API_PORT: Joi.number().optional().label('BASE_API_PORT'),
});
