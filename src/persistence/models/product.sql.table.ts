import { Knex } from "knex";

export const ProductSQLTable = (table :Knex.TableBuilder) =>{
    table.increments("id");
    table.string("name", 20);
    table.integer("price").nullable();
    table.string("imgUrl", 1500);
}
