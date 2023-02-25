import { Request, Response } from 'express';
import { ProductDTO } from '../DTOs/product.dto';
import { Controller } from '../interfaces/controller.interface';
import { MANAGERTYPE } from '../persistence/enums/managerType.enum';
import { createManager } from '../persistence/managerFactory';
import { errorLogger } from '../services/logger.service';
import { SocketService } from '../services/socket.service';




export const getProducts :Controller =  async (req :Request|any, res :Response|any) => {
    try {
        const productManager = createManager(MANAGERTYPE.PRODUCTS);
        if(productManager === null) {
            throw new Error("Failed to create product manager");
        }
        productManager.getObjects().then((products:any[]) => {
            let productDTO :ProductDTO[] = products.map((product:any) => {return new ProductDTO(product)});
            res.send({success: true, products: productDTO})
        })
        .catch(err => {
            errorLogger.error({
                message: "Failed to get products",
                error: err,
                url: req.url,
                method: req.method
            });
            res.send({success: false, message: err || "Failed to get products"})
        })
    }
    catch(err) {
        errorLogger.error({
            message: "Failed to get products",
            error: err,
            url: req.url,
            method: req.method
        });
        res.send({success: false, message: err || "Failed to get products"})
    }
}

export const updateProduct :Controller =  async (req :Request|any, res :Response|any) => {
    try {
        const io = SocketService.getInstance().getSocketServer();
        const productManager = createManager(MANAGERTYPE.PRODUCTS);
        if(productManager === null) {
            throw new Error("Failed to create product manager");
        }
        /*
        if(req.session.user == undefined){
            let error = {success: false, message: "not_logged"};
            errorLogger.error({
                message: "User not logged in",
                url: req.url,
                method: req.method
            })
            throw error
        }
        */
        let product = req.body;
        Object.assign(product, {price: parseInt(product.price)});
        productManager.update(product, req.params.id).then(() => {
            productManager.getObjects().then((products:any[]) => {
                let productDTO :ProductDTO[] = products.map((product:any) => {return new ProductDTO(product)});
                io.sockets.emit("products", {products: productDTO})
            });
            res.send({success: true, message: `Product with id ${req.params.id} updated`, newProduct: product});
        });

    } catch(err) {
        errorLogger.error({
            message: "Failed to update product",
            error: err,
            url: req.url,
            method: req.method
        });
        res.send({success: false, message: err || "Failed to update product"})
    }
}



export const deleteProduct :Controller =  async (req :Request|any, res :Response|any) => {
    try {
        let id = req.params.id;
        const io = SocketService.getInstance().getSocketServer();
        const productManager = createManager(MANAGERTYPE.PRODUCTS);
        if(productManager === null) {
            throw new Error("Failed to create product manager");
        }
        /*
        if(req.session.user == undefined){
            let error = {success: false, message: "not_logged"};
            errorLogger.error({
                message: "User not logged in",
                url: req.url,
                method: req.method
            })
            throw error
        }
        */
        productManager.delete(id).then(() => {
            productManager.getObjects().then((products:any[]) => {
                let productDTO :ProductDTO[] = products.map((product:any) => {return new ProductDTO(product)});
                io.sockets.emit("products", {products: productDTO})
            })
            res.send({success: true, message: `Product with id ${id} deleted`});
        });
    } catch(err) {
        errorLogger.error({
            message: "Failed to delete product",
            error: err,
            url: req.url,
            method: req.method
        });
        res.send({success: false, message: err || "Failed to delete product"})
    }
}


export const newProduct :Controller =  async (req :Request|any, res :Response|any) => {
    try {
        const io = SocketService.getInstance().getSocketServer();
        const productManager = createManager(MANAGERTYPE.PRODUCTS); 
        if(productManager === null) {
            throw new Error("Failed to create product manager");
        }
        /*
        if(req.session.user == undefined){
            let error = {success: false, message: "not_logged"};
            errorLogger.error({
                message: "User not logged in",
                url: req.url,
                method: req.method
            })
            throw error
        }
        */
        let product = req.body;
        Object.assign(product, {price: parseInt(product.price)});
        productManager.save(product).then((newProduct) => {
            productManager.getObjects().then((products:any[]) => {
                let productDTO :ProductDTO[] = products.map((product:any) => {return new ProductDTO(product)});
                io.sockets.emit("products", {products: productDTO})
                res.send({success: true, newProduct: newProduct})
            })
        })
        .catch(err => {
            errorLogger.error({
                message: "Failed to add product",
                error: err,
                url: req.url,
                method: req.method
            });
            res.send({success: false, message: err || "Failed to add product"})
        })
    }
    catch(err) {
        errorLogger.error({
            message: "Failed to add product",
            error: err,
            url: req.url,
            method: req.method
        });
        res.send({success: false, message: err || "Failed to add product"})
    }
}
