import knex, { Knex } from "knex";
import { errorLogger, logger } from "../../services/logger.service";
import { MessageSQLTable } from "../models/message.sql.table";
import { ProductSQLTable } from "../models/product.sql.table";
import { sqloptions } from "./mysqlconfig";
import { sqliteconfig } from "./sqliteconfig";

export class SQLDatabaseConnection {
    private static _instance: SQLDatabaseConnection = new SQLDatabaseConnection();
    private static database: Knex;
    private constructor() {
        SQLDatabaseConnection._instance = this;
    }
    public static getInstance(): SQLDatabaseConnection {
        return SQLDatabaseConnection._instance;
    }
    public getDatabase(): Knex {
        return SQLDatabaseConnection.database;
    }
    private createTableIfNotExists(): void {
        let tables = [{
            name: "products",
            schema: ProductSQLTable
        }, {
            name: "messages",
            schema: MessageSQLTable
        }];
        tables.forEach((table) => {
            SQLDatabaseConnection.database.schema.hasTable(table.name).then((exists) => {
                if(!exists) {
                    SQLDatabaseConnection.database.schema.createTable(table.name, table.schema)
                    .then(() => {
                        logger.info(`Table ${table.name} created because it didn't exist`);
                    })
                }
            });
        });
    }
    public connect(databaseName :string): void {
        if(!SQLDatabaseConnection.database) {
            let config :null|Knex.Config = null;
            if(databaseName === "SQLITE")
                config = sqliteconfig;
            if(databaseName === "SQL")
                config = sqloptions;
            if(config) {
                SQLDatabaseConnection.database = knex(config);
                logger.info(`Connected to ${databaseName} database`);
                this.createTableIfNotExists();
                return;
            }
            errorLogger.error("Cannot connect to database because the database name is not valid");
            throw new Error("Cannot connect to database because the database name is not valid");
        } else {
            errorLogger.error("Cannot connect to database because it is already connected");
            throw new Error("Cannot connect to database because it is already connected");
        }
    }
}
