import { Router } from "express";
import { upload } from "../middlewares/multer.middlware.js";
import { loggedOutUser, loginUser, registerUser } from "../controllers/user.controller.js";
import { User } from "../../models/user.models.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const Userrouter = Router()

Userrouter.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1,
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser);

Userrouter.route("/login").post(loginUser);

// secure routes
Userrouter.route("/logout").poist(verifyJWT,loggedOutUser); 

export {Userrouter};