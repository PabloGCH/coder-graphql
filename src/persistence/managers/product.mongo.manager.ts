import { MongoClient } from "../clients/mongo.client";
import { ProductMongoModel } from "../models/product.mongo.model";

export class ProductMongoManager extends MongoClient {
  constructor() {
    super(ProductMongoModel);
  }
}
