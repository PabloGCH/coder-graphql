import { SQLClient } from "../clients/sql.client";

export class MessageSQLManager extends SQLClient {
    constructor() {
        super('messages');
    }
}
