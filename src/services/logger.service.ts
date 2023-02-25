import log4js from "log4js";
import { configureLogger } from "../config/logger/logger";
/*
if(process.env.MOCHA_TEST === "true") {
    log4js.shutdown();
} else {
    configureLogger();
}
*/
    configureLogger();
export const logger = log4js.getLogger("default");
export const warningLogger = log4js.getLogger("warnings");
export const errorLogger = log4js.getLogger("errors");
