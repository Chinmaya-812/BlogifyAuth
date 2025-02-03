import { User } from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponses.js";


const generateAccessAndRefreshTokens = async (userDetails) => {
    try {
        const user = await User.findById(userDetails._id);
        const accessToken = user.generateAccesstoken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        user.save({ validateBeforeSave: false });


        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, 'Something went wrong ! While generating refresh & access tokens')
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const { username, email, fullname, password } = req.body

    console.log(req.body);

    if (!username || !email || !fullname || !password) {
        throw new ApiError(400, 'All Field are Mandatory to filled Up');
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(401, "User with email or username that you entered is alredy Exist");
    }

    const user = await User.create({
        username,
        fullname,
        email,
        password,
    })

    const createdUser = await User.findById(user._id).select('-password -refreshToke -Posts');

    if (!createdUser) {
        throw new ApiError(400, "Something went Wrong while registering User");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createdUser, 'User registered SuuceeFully'));

})


const loginUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body

    console.log(req.body);

    if (!username && !email) {
        throw new ApiError(400, 'All Field are Mandatory to filled Up');
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User doesn't Exist");
    }

    const isPasswordValid = await user.isCorrectPassword(password);

    if (!isPasswordValid) {
        throw new ApiError('401', "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);

    // console.log("accessToken-----", accessToken)
    // console.log("refreshToken----", refreshToken)

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    const options = {
        httponly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User Logged In Successfully"
            )
        )


})

const logoutUser = asyncHandler(async (req, res) => {

    const user = req.user

    await User.findByIdAndUpdate(user._id, {
        $unset: { refreshToken: "" }
    })

    const options = {
        httponly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out !"))

})

const getCurrentUser = asyncHandler(async (req, res) => {
    const currentUser = req.user;

    if (!currentUser) {
        throw new ApiError(400, "Unauthrozed Request");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, currentUser, "Current User In SuuceeFully"))
})


export { registerUser, loginUser, logoutUser, getCurrentUser };