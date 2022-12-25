"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preparePinoMultistream = void 0;
const pino_1 = __importDefault(require("pino"));
const pino_pretty_1 = __importDefault(require("pino-pretty"));
const pino_tee_1 = __importDefault(require("pino-tee"));
const isErrorLog = (line) => line.level >= 50;
const isNonErrorLog = (line) => line.level < 50;
function createPinoFilteredStream(filter, target) {
    const stream = (0, pino_tee_1.default)(process.stdin);
    stream.tee(target, filter);
    return stream;
}
function createPinoMainStream(extendedLogs) {
    return extendedLogs
        ? (0, pino_pretty_1.default)({ colorize: true })
        : createPinoFilteredStream(isNonErrorLog, process.stdout);
}
function preparePinoMultistream(extendedLogs) {
    const streams = [
        createPinoFilteredStream(isErrorLog, process.stderr),
        createPinoMainStream(extendedLogs),
    ].filter((v) => v);
    return pino_1.default.multistream(streams);
}
exports.preparePinoMultistream = preparePinoMultistream;
//# sourceMappingURL=functions.js.map