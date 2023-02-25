import { Knex } from "knex";

export const sqloptions :Knex.Config = {
	client: "mysql",
	connection: {
		host: "127.0.0.1",
		user: "root",
		password: "",
		database: "coderDb"
	}
}
