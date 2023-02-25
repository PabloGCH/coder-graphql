export class ProductDTO {
    public id: number|string;
    public name: string;
    public price: number;
    public imgUrl: string;
    constructor(object :any) {
        this.id = object.id || object._id || "";
        this.name = object.name || "";
        this.price = object.price || 0;
        this.imgUrl = object.imgUrl || "";
    }
}
