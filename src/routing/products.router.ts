import express from "express";
import { deleteProduct, getProducts, newProduct, updateProduct } from "../controllers/products.controller";
const router = express.Router();
router.post("/product", newProduct);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);
router.get("/products", getProducts);
export {router as productsRouter};
