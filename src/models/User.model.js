import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: [true, 'username should be lowercase'],
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        Posts: [{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }],
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [3, 'Password must be at least 3 characters long'], // Custom message for minlength
            maxlength: [15, 'Passoword must be no more than 15 characters long']
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isCorrectPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


userSchema.methods.generateAccesstoken = function () {
    const token = jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

    return token;
}


userSchema.methods.generateRefreshToken = function () {
    const token = jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOEKN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

    return token;
}


export const User = mongoose.model('User', userSchema);