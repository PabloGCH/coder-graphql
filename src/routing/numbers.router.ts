import express from "express";
import {fork} from "child_process";

const router = express.Router();      

router.get("/randoms", (req:any, res :any) => {
    const randNumProcess = fork("src/services/child-process/randomNumbers.ts");
    const cant = req.query.cant;
    randNumProcess.send(cant||400);
    randNumProcess.on("message", (data) => {
        return res.send(data);
    })
});

export {router as numbersRouter}
