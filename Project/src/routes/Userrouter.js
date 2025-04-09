import { Router } from "express";
import { upload } from "../middlewares/multer.middlware.js";
import { changePassword, getcurrentUser, loggedOutUser, loginUser, refershAccessToken, registerUser, updateAccount } from "../controllers/user.controller.js";
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
Userrouter.route("/logout").post(verifyJWT,loggedOutUser);
Userrouter.route("/refreshToken").post(refershAccessToken);
Userrouter.route("/changePasswoed").post(verifyJWT,changePassword);
Userrouter.route("/currentUser").post(verifyJWT,getcurrentUser);
Userrouter.route("/updateDetails").post(verifyJWT,upload.fields([
    {
        name:"avatar",
        maxCount:1,
    },
    {
        name:"coverImage",
        maxCount:1
    }
    ]),updateAccount);
   
export {Userrouter};