import { MongoClient } from "../clients/mongo.client";
import { MessageMongoModel } from "../models/message.mongo.model";


export class MessageMongoManager extends MongoClient {
  constructor() {
    super(MessageMongoModel);
  }
}
