import express from "express";
import { createNewPost, deletePost, getAllPost, updatePost, viewPostByUser } from "../controller/post.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";



const postRouter = express.Router();



postRouter.route("/createPost").post(upload.single('ContentImage'), verifyJWT, createNewPost)
postRouter.route("/viewPost").get(verifyJWT, viewPostByUser)
postRouter.route("/deletePost/:id").delete(verifyJWT, deletePost)

postRouter.route("/updatePost/:id").patch(verifyJWT, updatePost)

postRouter.route("/getAllPost").get(verifyJWT, getAllPost)



export default postRouter;