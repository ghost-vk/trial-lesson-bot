import Joi from 'joi';
import { AppConfig, EnvVariables } from './types';
export declare const convertEnvToBoolean: (env: string | undefined) => boolean;
export declare const availableEnvBoolean: string[];
export declare const loadConfig: () => AppConfig;
export declare const validationEnvSchema: Joi.ObjectSchema<EnvVariables>;
