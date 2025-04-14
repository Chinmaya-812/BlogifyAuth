import { Post } from "../models/Post.model.js";
import bcrypt from 'bcrypt'
import asyncHandler from "../utils/asyncHandler.js";
import { ADMIN_USER } from "../constant.js";
import { ApiResponse } from "../utils/ApiResponses.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";




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


const getAllPost = asyncHandler(async (req, res) => {

    const passwordValidate = await comparePasswords(ADMIN_USER.password, req.ADMINUSER.password)

    console.log(passwordValidate);

    // const checkAdminUser = (loginUser?.username == ADMIN_USER.username) ?

    const allPost = passwordValidate ? await Post.find({}).select("-user")
        : false;

    if (!allPost) {
        throw new ApiError(404, "Access restricted. Only ADMIN users can view all posts !")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, allPost, "All Posts Fetch Sucessfully"));
})


const getAllUsers = asyncHandler(async (req, res) => {
    console.log(req.ADMINUSER);
    console.log(req.user);
    

    const passwordValidate = await comparePasswords(ADMIN_USER.password, req.ADMINUSER.password)

    const allUser = passwordValidate ? await User.find().select("-password -refreshToken")
        : false;

    if (!allUser) {
        throw new ApiError(404, "Access restricted. Only ADMIN users can view all Users !")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, allUser, "All users fetched successfully"))

})



export { getAllPost, getAllUsers };