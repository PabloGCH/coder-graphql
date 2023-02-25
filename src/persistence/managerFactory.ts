import { MANAGERTYPE } from "./enums/managerType.enum";
import minimist from "minimist";
import { ProductSQLManager } from "./managers/product.sql.manager";
import { sqliteconfig } from "./config/sqliteconfig";
import { MessageSQLManager } from "./managers/message.sql.manager";
import { MessageMongoManager } from "./managers/message.mongo.manager";
import { ProductMongoManager } from "./managers/product.mongo.manager";
import { DbClient } from "./dbclient";
import { logger } from "../services/logger.service";
import knex, { Knex } from "knex";


const options = {default: {p: 8080, m: "FORK", d: "MONGO"}, alias:{p:"puerto", m:"mode", d:"database"}};
const args = minimist(process.argv.slice(2), options);

const database :Knex|null = args.d == "SQLITE" ? knex(sqliteconfig) : null;


export const createManager = (managerType :number) :DbClient|null => {
    if(managerType === MANAGERTYPE.PRODUCTS) {
        if(args.d === "MONGO") {
            logger.info({message: "Creating a new manager", type: "products", db: "mongo"});
            return new ProductMongoManager;
        }
        if(args.d === "SQLITE" && database) {
            logger.info({message: "Creating a new manager", type: "products", db: "sqlite"});
            return new ProductSQLManager;
        }
    }
    if(managerType === MANAGERTYPE.MESSAGES) {
        if(args.d === "MONGO") {
            logger.info({message: "Creating a new manager", type: "messages", db: "mongo"});
            return new MessageMongoManager;
        }
        if(args.d === "SQLITE" && database) {
            logger.info({message: "Creating a new manager", type: "messages", db: "sqlite"});
            return new MessageSQLManager;
        }
    }
    if(managerType === MANAGERTYPE.USERS) //USERS WILL ALWAYS BE STORED IN MONGO
        return new MessageMongoManager;   //AT LEAST FOR NOW
    return null;
}
