import { Request, Response } from 'express';
import bcrypt from "bcrypt";
import { UserModel } from '../persistence/models/user.mongo.model';
import { Controller } from '../interfaces/controller.interface';


export const register :Controller = async(req : Request|any, res : Response|any) => {
    res.send({success: req.success || false, message: req.message||""})
}
export const logoff :Controller = async (req : Response | any, res : Response) => {
    req.logout((err :any) => {
        if(err) return res.send("failed to close session")
            req.session.destroy((err :any) => {
                console.log(err);
            });
            res.redirect("/")
    });
}
export const login :Controller = async(req : Request|any, res : Response|any) => {
    try {
        const body = req.body;
        if(req.session.user) {
            res.send({message:"already logged"})
        } else if(body.username && body.password) {
            UserModel.findOne({username: body.username}, (err:any, userFound:any) => {
                if(err) {
                    res.send(err)
                }
                if(userFound) {
                    if(bcrypt.compareSync(body.password, userFound.password)) {
                        req.session.user = {
                            username: body.username,
                            password: body.password
                        }
                        res.send({success: true, message: "Session initialized"})
                    } else {
                        res.send({success: false, message: "Invalid password"})
                    }
                }
            })

        } else {
            res.send({success: false, message: "Invalid user inputs"})
        }
    } catch (err) {
        res.send({success: false, message: "Failed to login", error: err})
    }
}
