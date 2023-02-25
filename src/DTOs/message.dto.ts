export class MessageDTO {
    public id: string|number;
    public email: string;
    public date: string;
    public message: string;
    constructor(object :any) {
        this.id = object.id || object._id || "";
        this.email = object.email || "";
        this.date = object.date || "";
        this.message = object.message || "";
    }
}
