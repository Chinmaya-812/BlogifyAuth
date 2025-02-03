import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

const verifyJWT = asyncHandler(async (req, res, next) => {

    try {

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        // console.log(token)

        if (!token) {
            throw new ApiError(401, "Unauthorized request ! Please log in to access this resource")
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const authenticatedUser = await User.findById(decodeToken?._id).select("-password -refreshToken");
        const authenticatedUserWith_PWD = await User.findById(decodeToken?._id).select("-refreshToken");


        // console.log(verifyUser)
        if (!authenticatedUser) {
            throw new ApiError(401, "Invalid Access Token for this User")
        }

        req.user = authenticatedUser;
        req.ADMINUSER = authenticatedUserWith_PWD;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

export { verifyJWT }