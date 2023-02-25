import mongoose from "mongoose";
import { logger } from "../../services/logger.service";

export function initMongoDb() {
    //CONNECTS TO MONGO
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGODB_URL||"").then(
        () => {
            logger.info("Connected to MongoDB");
        },
        err => {
            console.log(err)
        }
    )
}
