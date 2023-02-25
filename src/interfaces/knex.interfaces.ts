import { Knex } from "knex";
export type knexTableBuilderCallback = (table: Knex.TableBuilder) => any;
