import { Request, Response } from "express";
import os from "os";
import { Config } from "../config/config";
import { UserDTO } from "../DTOs/user.dto";
import { Controller } from "../interfaces/controller.interface";
import { UserModel } from "../persistence/models/user.mongo.model";

export const getServerInfo :Controller = async (req: Request, res: Response) => {
    if(process.send) {
        process.send(process.pid);
    }
    const serverData = {
        os: process.platform,
        vnode: process.versions.node,
        rrs: process.memoryUsage.rss(),
        pid: process.pid,
        args: process.argv.slice(2).toString(),
        execPath: process.execPath,
        projectPath: process.env.PWD,
        cores: Config.NUMBER_OF_CORES,
    }
    res.send(serverData);
}
export const getUsers :Controller = async (req: Request, res: Response) => {
    let users :any[] = await UserModel.find({});
    let userDTO :UserDTO[] = users.map(user => {return new UserDTO(user)});
    res.send({success: true, message: "Users fetched", response: userDTO});
}
