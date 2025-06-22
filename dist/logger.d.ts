interface ILoggerConnector {
    level: string;
    message: string;
    context: any;
}
type LoggerConnector = (connector: ILoggerConnector) => void;
declare class Logger {
    private static readonly levels;
    private static getLevelIdx;
    level: string;
    connector?: LoggerConnector;
    constructor(level: string, connector?: LoggerConnector);
    error(message: any, context: any): void;
    warn(message: any, context: any): void;
    info(message: any, context: any): void;
    debug(message: any, context: any): void;
    verbose(message: any, context: any): void;
    log(level: any, message: any, context: any): void;
}
export declare const log: Logger;
export {};
