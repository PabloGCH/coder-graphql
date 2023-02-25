import app from "../src/server"
import supertest from "supertest"
import { expect } from "chai"
import log4js from "log4js";
log4js.shutdown();

const request = supertest(app)


let id = -1;
describe("LOGIN TEST", () => {
    it("USER WAS LOGGED", (done) => {
        let logData :any = {
            username: "asd",
            password: "123",
        };
        request.post(`/api/auth/login`)
        .send(logData)
        .then((res) => {
            expect(res.status).to.equal(200)
            done();
        }).catch(done)
    });
});
describe("GET PRODUCTS", () => {
    it("GET PRODUCTS", (done) => {
        request.get(`/api/products/products`)
        .then((res :any) => {
            expect(res.body.success).to.ok;
            expect(res.body.products).to.be.an("array");
            done();
        }).catch(done)
    })
});
describe("ADD PRODUCT", () => {
    let newProduct = {
        name: "new product",
        price: 400,
        imgUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.BcNb40Mq_PfOj795lDFqaAHaFV%26pid%3DApi&f=1&ipt=5d7140326ebeb108d2cb5cf625cd7be07f95cc4fcf3f908cc6f0c41d04e8c5b2&ipo=images" 
    };
    let response :any;
    it("REQUEST WAS SUCCESFUL", (done) => {
        request.post(`/api/products/product`).send(newProduct)
        .then((res) => {
            response = res;
            expect(res.status).to.equal(200);
            expect(res.body.success).to.ok;
            done();
        }).catch(done)
    });
    it("PRODUCT WAS ADDED", () => {
        expect(response.body.newProduct).to.ok;
    });
    it("PRODUCT WAS ADDED WITH CORRECT NAME", () => {
        expect(response.body.newProduct.name).to.equal(newProduct.name);
    });
    it("PRODUCT WAS ADDED WITH CORRECT PRICE", () => {
        expect(response.body.newProduct.price).to.equal(newProduct.price);
    });
    it("PRODUCT WAS ADDED WITH CORRECT IMGURL", () => {
        expect(response.body.newProduct.imgUrl).to.equal(newProduct.imgUrl);
    });
});

describe("UPDATE PRODUCT", () => {
    let newProduct = {
        name: "new name product",
        price: 150,
        imgUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.BcNb40Mq_PfOj795lDFqaAHaFV%26pid%3DApi&f=1&ipt=5d7140326ebeb108d2cb5cf625cd7be07f95cc4fcf3f908cc6f0c41d04e8c5b2&ipo=images" 
    };
    let response :any;
    it("REQUEST WAS SUCCESFUL", (done) => {
        request.put(`/api/products/product/${id}`)
        .send(newProduct)
        .then((res) => {
            response = res;
            expect(res.status).to.equal(200);
            expect(res.body.success).to.ok;
            id = res.body.newProduct._id || res.body.newProduct.id || -1;
            done();
        })
    });
    it("PRODUCT WAS UPDATED WITH CORRECT NAME", () => {
        expect(response.body.newProduct.name).to.equal(newProduct.name);
    });
    it("PRODUCT WAS UPDATED WITH CORRECT PRICE", () => {
        expect(response.body.newProduct.price).to.equal(newProduct.price);
    });
    it("PRODUCT WAS UPDATED WITH CORRECT IMGURL", () => {
        expect(response.body.newProduct.imgUrl).to.equal(newProduct.imgUrl);
    });
});

describe("DELETE PRODUCT", () => {
    it("REQUEST WAS SUCCESFUL", (done) => {
        request.delete(`/api/products/product/${id}`)
        .then((res :any) => {
            expect(res.status).to.equal(200);
            expect(res.body.success).to.ok;
            done();
        })
        .catch(done)
    });
});











