import mongoose, { Types } from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    active:{
        type:Boolean,
        default:true,
    },
    rememberMe: {
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: true,
    }

);

export const User = mongoose.model("User", userSchema);