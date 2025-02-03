import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createNewPost,viewPostByUser,deletePost,updatePost } from "../controller/post.controller.js";
import { getAllPost,getAllUsers } from "../controller/Admin.controller.js";

import { upload } from "../middleware/multer.middleware.js";


const router = Router()

router.route('/registerUser').post(registerUser);
router.route('/loginUser').post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/currentUser").get(verifyJWT, getCurrentUser);


router.route("/createPost").post(upload.single('ContentImage'), verifyJWT, createNewPost)
router.route("/viewPost").get(verifyJWT, viewPostByUser)
router.route("/deletePost/:id").delete(verifyJWT, deletePost)

router.route("/updatePost/:id").patch(verifyJWT, updatePost)



router.route("/getAllPost").get(verifyJWT, getAllPost)
router.route("/getAllUser").get(verifyJWT, getAllUsers)



export default router