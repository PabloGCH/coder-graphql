import express from "express";
import passport from "passport";

import { login, logoff, register} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", passport.authenticate("signupStrategy", {
    failureRedirect: "/register",
    failureMessage: true
}), register);
router.get("/logoff", logoff)
router.post("/login", login)


export { router as authRouter }
