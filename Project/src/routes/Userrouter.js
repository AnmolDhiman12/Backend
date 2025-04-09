import { Router } from "express";
import { upload } from "../middlewares/multar..js";
import { loginUser, registerUser } from "../controllers/user.controller.js";


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

export {Userrouter};