import { DbClient } from "../dbclient";
import { Knex } from "knex";
import { SQLDatabaseConnection } from "../config/knex.config";



export class SQLClient implements DbClient {
    private tableName :string;
    private database:Knex;
    constructor(tableName: string) {
        this.tableName = tableName;
        this.database = SQLDatabaseConnection.getInstance().getDatabase();
    }
    public async save(object: any): Promise<any> {
        let newObject = await this.database(this.tableName).insert(object);
        return newObject;
    }
    public async update(id: string | number, object: any): Promise<any> {
        let newObject = await this.database(this.tableName).first({id: id}).update(object);
        return newObject;
    }
    public async delete(id: number): Promise<void> {
        await this.database(this.tableName).where({id: id}).del();
    }
    public async getObjects(): Promise<any[]> {
        let objects = await this.database(this.tableName).select();
        return objects;
    }
    public async getObject(id: string | number): Promise<any> {
        let object = await this.database(this.tableName).first({id: id});
        return object;
    }
}
