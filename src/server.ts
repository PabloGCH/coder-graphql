// IMPORTS
import env from "dotenv";
env.config();
import express from "express";
import cluster from "cluster";
import { Config } from "./config/config";
import { initMongoDb } from "./persistence/config/mongo.config";
import { SQLDatabaseConnection } from "./persistence/config/knex.config";
//DABASE CONNECTIONS
initMongoDb(); //MONGO WILL ALWAYS BE CONNECTED, BECAUSE IT IS USED FOR AUTHENTICATION
if(Config.DATABASE_NAME === "SQLITE" || Config.DATABASE_NAME === "SQL")
    SQLDatabaseConnection.getInstance().connect(Config.DATABASE_NAME);
import { SocketService } from "./services/socket.service";
import { RouterManager } from "./routing/router";
import { logger } from "./services/logger.service";


const app = express();
//SERVER INITIALIZATION
if(Config.RUN_MODE.toUpperCase() == "CLUSTER" && cluster.isPrimary) {
    console.log("Server initialized on cluster mode");
    for(let i = 0; i < Config.NUMBER_OF_CORES ; i++) {
        cluster.fork();
    }
    cluster.on("exit", (worker, error) => {
        //RE RUN SUB PROCESS ON FAILURE
        cluster.fork();
    })
} else {
    if(Config.RUN_MODE.toUpperCase() == "FORK") {
        logger.info("Server initialized on fork mode");
    }
    Config.configServer(app);
    const server = app.listen(Config.PORT, ()=>{
        logger.info(`server listening on port ${Config.PORT}`);
    });
    SocketService.getInstance().connect(server);
    app.use("/", new RouterManager().getRouter());
}


export default app;


