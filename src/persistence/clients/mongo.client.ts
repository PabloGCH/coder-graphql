import { Model } from "mongoose";
import { DbClient } from "../dbclient";


export class MongoClient implements DbClient{
    private model :Model<any>;
    constructor(model :Model<any>) {
        this.model = model ;
    }
    public async save(object :any) :Promise<any> {
        let newObject :any = await this.model.create(object);
        return newObject;
    }
    public async delete(id: number) :Promise<void> {
        await this.model.findByIdAndDelete(id);
    }
    public async getObjects() :Promise<any[]> {
        let objects = await this.model.find({});
        return objects;
    }
    public async getObject(id: string | number) :Promise<any> {
        let object = await this.model.findById(id);
        return object;
    }
    public async update(id: string | number, object: any) :Promise<any> {
        let updatedObject = await this.model.findByIdAndUpdate(id, object);
        return updatedObject;
    }
}
