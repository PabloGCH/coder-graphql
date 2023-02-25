import log4js from "log4js";
export function configureLogger() {
    log4js.configure({
        appenders: {
            console: {type: "console"},
            warnLogFile: {type: "file", filename: "logs/warn.log"},
            errorLogFile: {type: "file", filename: "logs/error.log"}
        },
        categories: {
            default: { appenders: ["console"], level: "trace"},
            errors: { appenders: ["console", "errorLogFile"], level: "error"},
            warnings: { appenders: ["console" , "warnLogFile"], level: "warn"}
        }
    })
}

