export interface AppConfig {
    NODE_ENV: string;
    APPLICATION_PORT: number;
    APPLICATION_HOST: string;
    LOGGER: boolean;
}
export type EnvBoolean = 'y' | 'n';
export interface EnvVariables {
    NODE_ENV: string;
    APPLICATION_PORT: number;
    APPLICATION_HOST: string;
    LOGGER: EnvBoolean;
}
