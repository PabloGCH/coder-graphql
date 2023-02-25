import {buildSchema} from 'graphql';
import { Message } from '../interfaces/message.interface';
import { Product } from '../interfaces/product.interface';
import { DbClient } from '../persistence/dbclient';
import { MANAGERTYPE } from '../persistence/enums/managerType.enum';
import { createManager } from '../persistence/managerFactory';

const productManager :DbClient|null = createManager(MANAGERTYPE.PRODUCTS);
const messageManager :DbClient|null = createManager(MANAGERTYPE.MESSAGES);
interface MutationResponse {
    success: boolean,
    message: string
}


function addProduct({name, price, imgUrl} :Product ) : MutationResponse {
    if(productManager) {
        let newProduct :Product = {
            name: name,
            price: price,
            imgUrl: imgUrl
        };
        productManager.save(newProduct);
        return {success: true, message: 'Product added successfully'};
    }
    return {success: false, message: 'Product Manager not found'};
}

function addMessage({email, message, date} :Message) : MutationResponse {
    let newMessage = {
        email: email,
        message: message,
        date: date
    };
    if(messageManager) {
        messageManager.save(newMessage);
        return {success: true, message: 'Message added successfully'};
    }
    return {success: false, message: 'Message Manager not found'};
}
function removeProduct({id} :{id: string}) : MutationResponse {
    if(productManager) {
        productManager.delete(id);
        return {success: true, message: 'Product removed successfully'};
    }
    return {success: false, message: 'Product Manager not found'};
}
function updateProduct({id, name, price, imgUrl} : Product) : MutationResponse {
    let newProduct :Product = {
        name: name,
        price: price,
        imgUrl: imgUrl
    };
    if(productManager) {
        productManager.update(id || "", newProduct);
        return {success: true, message: 'Product updated successfully'};
    }
    return {success: false, message: 'Product Manager not found'};
}
function getProducts() {
    if(productManager) {
        return productManager.getObjects();
    }
    return [];
}


export const graphqlSchema = buildSchema(
    `
    type product {
        id: String
        name: String
        price: Int
        imgUrl: String
    }
    type message {
        id: String
        name: String
        email: String
        message: String
    }
    type mutationResponse {
        success: Boolean
        message: String
    }
    type Query {
        getProducts: [product]
    }
    type Mutation {
        addProduct(name: String, price: Int, imgUrl: String) : mutationResponse
        addMessage(email: String, message: String, date :String) : mutationResponse
        removeProduct(id: String) : mutationResponse
        updateProduct(id: String, name: String, price: Int, imgUrl: String) : mutationResponse
    }
    `
);

export const graphqlRoot = {
    getProducts,
    addProduct,
    addMessage,
    removeProduct,
    updateProduct
}
