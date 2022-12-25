"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLoggerModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_pino_1 = require("nestjs-pino");
const pino_1 = require("pino");
const functions_1 = require("./functions");
let AppLoggerModule = class AppLoggerModule {
};
AppLoggerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_pino_1.LoggerModule.forRootAsync({
                useFactory: async (configService) => ({
                    pinoHttp: [
                        {
                            level: configService.get('LOGGER') ? 'debug' : 'info',
                            redact: ['req.headers.cookie', 'req.headers.authorization'],
                            timestamp: pino_1.stdTimeFunctions.isoTime,
                        },
                        (0, functions_1.preparePinoMultistream)(configService.get('LOGGER')),
                    ],
                }),
                inject: [config_1.ConfigService],
            }),
        ],
    })
], AppLoggerModule);
exports.AppLoggerModule = AppLoggerModule;
//# sourceMappingURL=appLogger.module.js.map