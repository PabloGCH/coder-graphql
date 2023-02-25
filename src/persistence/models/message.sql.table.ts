import { Knex } from "knex";

export const MessageSQLTable= (table :Knex.TableBuilder) =>  {
    table.increments("id");
    table.string("email", 40);
    table.string("date", 70);
    table.string("message", 500);
}
