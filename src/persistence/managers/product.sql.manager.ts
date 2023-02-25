import { SQLClient } from "../clients/sql.client";

export class ProductSQLManager extends SQLClient {
    constructor(){
        super('products');
    }
}
