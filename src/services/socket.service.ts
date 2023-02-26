import { Socket, Server as SocketServer} from "socket.io";
import { MANAGERTYPE } from "../persistence/enums/managerType.enum";
import { createManager } from "../persistence/managerFactory";
import { errorLogger, logger } from "./logger.service";

const productManager = createManager(MANAGERTYPE.PRODUCTS);
const messageManager = createManager(MANAGERTYPE.MESSAGES);

export class SocketService {
    private static _instance :SocketService = new SocketService();
    private static io :SocketServer|null = null;
    public connect(server :any) {
        if(!SocketService.io) {
            SocketService.io = new SocketServer(server);
            logger.info("Socket server initialized")
            this.startConnectionEvents();
            return;
        }
        errorLogger.error("Cannot initialize socket server. Socket server already initialized");
        throw new Error("Cannot initialize socket server. Socket server already initialized");
    }
    private startConnectionEvents() {
        if(SocketService.io === null) {
            errorLogger.error("Cannot start connection events. Socket server not initialized");
            throw new Error("Socket server not initialized")
        }
        SocketService.io.on("connection", async (socket :Socket) => {
            if(productManager === null) {
                errorLogger.error("Cannot start connection events. Product manager not created");
                throw new Error("Cannot start connection events. Product manager not created");
            }
            if(messageManager === null) {
                errorLogger.error("Cannot start connection events. Message manager not created");
                throw new Error("Cannot start connection events. Message manager not created");
            }
            let products = await productManager.getObjects();
            socket.emit("products", {products: products})
            let messages = await messageManager.getObjects();
            socket.emit("messages", {messages: messages})
        })
        SocketService.io.on('error', function (err :any) {
            console.log(err);
        });
    }
    public getSocketServer() :SocketServer {
        if(SocketService.io === null) {
            errorLogger.error("Cannot get socket server. Socket server not initialized");
            throw new Error("Can't get socket server. Socket server not initialized");
        }
        return SocketService.io 
    }
    public static getInstance() :SocketService { return SocketService._instance }
    private constructor() {}
}
