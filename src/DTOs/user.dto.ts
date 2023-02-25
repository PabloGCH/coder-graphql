export class UserDTO {
    public id: string|number;
    public username: string = "";
    constructor(object:any) {
        this.id = object.id || object._id || "";
        this.username = object.username || "";
    }
}
