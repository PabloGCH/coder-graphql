import express from 'express';
import passport from "passport";
import bcrypt from "bcrypt";
import passportLocal from "passport-local";
import { UserModel } from '../../persistence/models/user.mongo.model';

const createHash = (password :string) => {
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    return hash;
}

export function configurePassport(app: express.Application) {
    //PASSPORT CONFIGURATION
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser((user :any,done)=>{
        done(null,user.id);
    })
    passport.deserializeUser((id, done)=>{
        UserModel.findById(id, (err:any, userFound :any) => {
            if(err) return done(err);
            return done(null, userFound);
        })
    })
    //REGISTER STRATEGY
    passport.use("signupStrategy", new passportLocal.Strategy(
        {
            passReqToCallback: true,
        },
        (req, username, password, done) => {
            UserModel.findOne({username: username}, (err:any, userFound:any) => {
                if(err) return done(err);
                if(userFound) {
                    Object.assign(req, {success: false, message: "user already exists"})
                    return done(null, userFound);
                }
                const newUser = {
                    username: username,
                    password: createHash(password)
                }
                UserModel.create(newUser, (err, userCreated) => {
                    if(err) return done(err, null, {message: "failed to register user"});
                    Object.assign(req, {success: true,message: "User created"})
                    return done(null, userCreated)
                })
            })
        }
    ));
}
