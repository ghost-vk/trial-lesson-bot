"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const nestjs_pino_1 = require("nestjs-pino");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    const logger = app.get(nestjs_pino_1.Logger);
    const port = config.get('APPLICATION_PORT', { infer: true });
    await app.listen(port);
    logger.log(`⚡️ Application started successfully on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map