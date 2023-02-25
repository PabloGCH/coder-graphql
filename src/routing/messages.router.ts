import express from "express";
import { newMessage } from "../controllers/messages.controller";
const router = express.Router();
router.post("/message", newMessage);
export {router as messageRouter};


