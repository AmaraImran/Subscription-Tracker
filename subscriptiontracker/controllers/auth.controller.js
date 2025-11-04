import mongoose from "mongoose"
import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
export const signUp=async(req,res,next)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
 try {
    const {fullname,email,password}=req.body;
    const existinguser=await User.findOne({email})
    if(existinguser){
        const error=new Error("User already exists with this email")
        error.statusCode=400
        throw error
    }
//hash password !
const salt=await bcrypt.genSalt(10);
const hashedpassword=await bcrypt.hash(password,salt);
const newUser=await User.create([{
    name:fullname,
    email,
    password:hashedpassword
}],{session})
const token=jwt.sign({userId:newUser[0]._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})
await session.commitTransaction();
session.endSession();
res.status(201).json({
    message:"User registered successfully",
    token,
    user:newUser[0]
})

 } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
 }
}
export const SignIn=async(req,res,next)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email})
        if(!user){
            const error=new Error("Invalid email or password");
            error.statusCode=401;
            throw error;
        }
        const ispasswordmatch=await bcrypt.compare(password,user.password);
        if(!ispasswordmatch){
            const error=new Error("Invalid email or password");
            error.statusCode=401;
            throw error;
        }
        const token=jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})
        res.status(200).json({
            success:true,
            message:"Signed in successfully",
            token,
            user
        })

        
    } catch (error) {
        next(error);
    }

}
