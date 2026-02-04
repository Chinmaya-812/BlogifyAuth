import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser,sendOtp, verifyOtp } from "../controller/user.controller.js";
import { verifyJWT,refreshAccessToken } from "../middleware/auth.middleware.js";
import {getAllUsers } from "../controller/Admin.controller.js";



const router = Router()

router.route('/registerUser').post(registerUser);
router.route('/login').post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/currentUser").get(verifyJWT, getCurrentUser);

router.route("/getAllUser").get(verifyJWT, getAllUsers)

router.route('/auth/refresh').post(refreshAccessToken);



// OTP Based Login
router.route('/send').post(sendOtp);
router.route('/loginOTP').post(verifyOtp);



export default router