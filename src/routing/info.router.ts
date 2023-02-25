import express from "express";
import compression from "compression";
import { getServerInfo, getUsers } from "../controllers/info.controller";


const router = express.Router();

router.get("/server", compression(), getServerInfo)
router.get("/user", (req :any, res :any) => {
    res.send(req.session.user.name)
})
router.get("/users", getUsers)

export { router as infoRouter };


