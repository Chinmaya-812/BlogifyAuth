import { Router } from "express";
import { createNewPost, deletePost, updatePost, viewPostByUser } from "../controller/post.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";



const router = Router();

// router.route("/createPost").post(upload.single('ContentImage'), verifyJWT, createNewPost)
// router.route("/viewPost").get(verifyJWT, viewPostByUser)
// router.route("/deletePost/:id").delete(verifyJWT, deletePost)
// router.route("/updatePost/:id").patch(verifyJWT, updatePost)


export default router