// TODO

import asyncHandler from "../utils/asyncHandler.js";
import { Post } from "../models/Post.model.js";
import { ApiError } from "../utils/ApiError.js";
import uploadOnCloudinary from "../middleware/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponses.js";
import { User } from "../models/User.model.js";
import mongoose from "mongoose";
import { ADMIN_USER } from "../constant.js";
import bcrypt from 'bcrypt'

// 1. Creata a new post using as per the post model --> POST
// 2. As per the user can view the post of indivisuals --> GET
// 3. Create User can modify or Delete the post that he made  -->  Patch , Delete
// 4. Create CPadmin user who can delete other user post also.And he can we See the all post with details 



const createNewPost = asyncHandler(async (req, res) => {
    const { title, content } = req.body
    console.log(req.file.path);

    console.log(req.user)

    const contentImageLocalPath = req.file?.path;

    if (!contentImageLocalPath) {
        throw new ApiError('Content Image is Required !');
    }

    const contentImage = await uploadOnCloudinary(contentImageLocalPath);


    const post = await Post.create({
        title,
        content,
        ContentImage: contentImage?.url,
        user: req.user._id,
    })

    const user = req.user;

    user.Posts.push(post?._id);
    await user.save({ new: true });

    console.log(user)

    if (!post) {
        throw new ApiError(500, "Something Went wrong while Creating Post");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, post, "Post Created SuuceeFully"));

})


const viewPostByUser = asyncHandler(async (req, res) => {
    const user = req.user;

    const usersWithPosts = await User.aggregate([
        {
            $match: {
                _id: user?._id
            }
        },
        {
            $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "user",
                as: "allPosts"
            }
        },
        {
            $project: {
                username: 1,
                email: 1,
                allPosts: {
                    $map: {                     // Map over allPosts array
                        input: "$allPosts",     // Array of posts matched from $lookup
                        as: "post",             // Alias for each post
                        in: {
                            _id: '$$post._id',
                            title: '$$post.title',        // Include title of each post
                            content: '$$post.content',    // Include content of each post
                            ContentImage: '$$post.ContentImage',    // Include ContentImage of each post
                        }
                    }
                }
            }
        }
    ]);

    return res
        .status(201)
        .json(new ApiResponse(200, usersWithPosts, "Fetched Post Successfully"))
})


const deletePost = asyncHandler(async (req, res) => {
    const user = req.user;

    const userPosts = await Post.find({ user: user?.id })

    // if (userPosts.length === 0) {
    //     throw new ApiError(401, "This User Dont have any post ! This function is right now Unaviavble");
    // }

    // console.log(userPosts)

    const isPostExistForUser = userPosts.some(post => post._id.toString() === req.params.id);

    // console.log(isPostExistForUser);




    // find the userpost ,if its found it will remove the posts from the array of user db
    const postRemovalResult = isPostExistForUser ? await User.updateOne(
        { _id: user?._id },
        { $pull: { Posts: new mongoose.Types.ObjectId(req.params.id) } }
    ) : false
    // console.log(postRemovalResult);



    // Once remove from the post array delete from the Post Db
    const removedPostFromDb = postRemovalResult ?
        await Post.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) })
        : false;

    if (!removedPostFromDb) {
        throw new ApiError(401, "Unable to find the post for the user with the given ID. Deletion operation cannot be performed.");
    }

    // console.log(removedPostFromDb);


    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Post deleted Successfully !"));


})


const updatePost = asyncHandler(async (req, res) => {
    const { title, content } = req.body

    if (!title && !content) {
        throw new ApiError(400, "All Fields are required")
    }

    const userPosts = await Post.find({ user: req.user?.id })
    // console.log("Posts  -->", userPosts)


    const isPostExistForUser = userPosts.some(post => post._id.toString() === req.params.id);


    // console.log("Exist :-> ", isPostExistForUser);


    const updatedPostResults = (isPostExistForUser ? await Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true }).select("-user -__v -ContentImage -_id")
        : false);
    


    if (!updatedPostResults) {
        throw new ApiError(400, "Unable to find the post for the user with the given ID ! Can't be Modify")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, updatedPostResults, "Post Updated Sucessfully !"))
})


const getAllPost = asyncHandler(async (req, res) => {
    const loginUser = req.user;
    console.log(loginUser)
    console.log(req.ADMINUSER);


    const passwordValidate = await comparePasswords(ADMIN_USER.password, req.ADMINUSER.password)

    console.log(passwordValidate);

    const allPosts = passwordValidate ? await User.find().select("-password -refreshToken")
        : false;

    if (!allPosts) {
        throw new ApiError(404, "Access restricted. Only ADMIN users can view all Users !")
    }

    const posts = await Post.find({}).select("-user")

    return res
        .status(200)
        .json(new ApiResponse(200, posts, "All data Fetch Sucessfully"));
})


/**
 * Compare the plain-text password entered by the user with the hashed password stored in the database.
 * @param {string} plainPassword - The plain-text password entered by the user.
 * @param {string} hashedPassword - The hashed password stored in the database.
 * @returns {Promise<boolean>} - Returns true if the passwords match, otherwise false.
 */

const comparePasswords = async (plainPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

    return isMatch;
}

export { createNewPost, viewPostByUser, deletePost, updatePost, getAllPost }
