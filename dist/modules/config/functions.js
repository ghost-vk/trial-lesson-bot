"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationEnvSchema = exports.loadConfig = exports.availableEnvBoolean = exports.convertEnvToBoolean = void 0;
const joi_1 = __importDefault(require("joi"));
const convertEnvToBoolean = (env) => {
    return env ? env === 'y' : false;
};
exports.convertEnvToBoolean = convertEnvToBoolean;
exports.availableEnvBoolean = ['y', 'n'];
const loadConfig = () => ({
    NODE_ENV: process.env.NODE_ENV,
    APPLICATION_PORT: +process.env.APPLICATION_PORT,
    APPLICATION_HOST: process.env.APPLICATION_HOST,
    LOGGER: (0, exports.convertEnvToBoolean)(process.env.LOGGER),
});
exports.loadConfig = loadConfig;
exports.validationEnvSchema = joi_1.default.object({
    NODE_ENV: joi_1.default.string().required().valid('production', 'development').label('NODE_ENV'),
    APPLICATION_PORT: joi_1.default.number().required().label('APPLICATION_PORT'),
    APPLICATION_HOST: joi_1.default.string().required().label('APPLICATION_HOST'),
    LOGGER: joi_1.default.string()
        .required()
        .valid(...exports.availableEnvBoolean)
        .label('LOGGER'),
});
//# sourceMappingURL=functions.js.map