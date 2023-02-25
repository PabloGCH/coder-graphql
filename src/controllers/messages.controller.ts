import { Request, Response } from 'express';
import { errorLogger } from "../services/logger.service";
import { createManager } from '../persistence/managerFactory';
import { MANAGERTYPE } from '../persistence/enums/managerType.enum';
import { Controller } from '../interfaces/controller.interface';
import { MessageDTO } from '../DTOs/message.dto';
import { SocketService } from '../services/socket.service';



export const newMessage :Controller = async (req: Request|any, res: Response|any) => {
    try {
        const io = SocketService.getInstance().getSocketServer();
        const messageManager = createManager(MANAGERTYPE.MESSAGES);
        if(messageManager === null) {
            throw new Error("Failed to create message manager");
        }
        if(req.session.user == undefined){
            errorLogger.error({
                message: "User not logged in",
                url: req.url,
                method: req.method
            })
            res.send({success: false, message: "not_logged"})
        } else {
            messageManager.save(req.body).then(() => {
                messageManager.getObjects().then(messages => {
                    let messageDTO :MessageDTO[] = messages.map((message) => {return new MessageDTO(message)})
                    io.sockets.emit("messages", {messages: messageDTO});
                    res.send({success: true})
                })
            }).catch((err) => {
                errorLogger.error({
                    message: "Failed to add message",
                    error: err,
                    url: req.url,
                    method: req.method
                });
                res.send({success: false, message: err || "Failed to add message"})
            })
        }
    }
    catch(err) {
        errorLogger.error({
            message: "Failed to add message",
            error: err || null,
            url: req.url,
            method: req.method
        })
        res.send({success: false, message: err || "Failed to add message"})
    }   
}
