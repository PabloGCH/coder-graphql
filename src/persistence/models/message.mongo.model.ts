import mongoose from "mongoose";
const collection = "messages";
const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})
export const MessageMongoModel = mongoose.model(collection, schema);
