import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
name:{
    type:String,
    required:[true,"Name is required"],
    trim:true,
    minLength:[3,"Name must be at least 3 characters long"],
    maxLength:[50,"Name can be at most 50 characters long"]
},
email:{
    type:String,
    required:[true,"Name is required"],
    trim:true,
    unique:true,
    lowercase:true,
    match:[/\S+@\S+\.\S+/,"Please provide a valid email address"]
},
password:{
    type:String,
    required:[true,"Password is required"],
    minLength:[6,"Password must be at least 6 characters long"]
}


},{timestamps:true})
const User=mongoose.model("User",userSchema)
export default User;