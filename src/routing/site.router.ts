import express from "express";

const router = express.Router();

router.get("/login", (req :any, res :any) => {
    if(req.session.user){
        res.redirect("stock")
    } else {
        res.sendFile("public/site/site.html", {root: __dirname + "/../"})
    }
})
router.get("/register", (req :any,res :any) => {
    res.sendFile("public/site/site.html", {root: __dirname + "/../"})
});
router.get("/logerror", (req :any, res :any) => {
    res.sendFile("public/site/site.html", {root: __dirname + "/../"})
});
router.get("/regerror", (req :any, res :any) => {
    res.sendFile("public/site/site.html", {root: __dirname + "/../"})
});

router.get("/stock", (req :any, res :any) => {
    if(req.session.user == undefined){
        res.redirect("login")
    } else {
        res.cookie("username", req.session.user.username)
        res.sendFile("public/site/site.html", {root: __dirname + "/../"})
    }
})
router.get("/form", (req :any, res :any) => {
    if(req.session.user == undefined){
        res.redirect("login")
    } else {

        res.cookie("username", req.session.user.username)
        res.sendFile("public/site/site.html", {root: __dirname + "/../"})
    }
})
router.get("/chat", (req :any, res :any) => {
    if(req.session.user == undefined){
        res.redirect("login")
    } else {
        res.cookie("username", req.session.user.username)
        res.sendFile("public/site/site.html", {root: __dirname + "/../"})
    }
})
router.get("/info", (req:any, res :any) => {
    if(req.session.user == undefined){
        res.redirect("login")
    } else {
        res.cookie("username", req.session.user.username)
        res.sendFile("public/site/site.html", {root: __dirname + "/../"})
    }
});
router.get("/*", (req :any, res :any) => {
    res.redirect("/site/login")
});
export {router as siteRouter};
