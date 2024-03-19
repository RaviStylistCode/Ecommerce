import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter your name"],
        minLength:[4,'name must be 4 char long'],
        trim:true
    },

    email:{
        type:String,
        trim:true,
        unique:[true,"email must be unique"],
        required:[true,'please enter email'],
        validate:validator.default.isEmail
    },

    password:{
        type:String,
        trim:true,
        required:[true,"please enter password"],
        minLength:[4,"password must be 4 character long"],
        select:false
    },

    role:{
        type:String,
        default:"user"
    },
    
    cart:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"product"
        }
    ],

    image:{
        type:String,
        default:"asdfghjkl"
    },

    otp:Number,
    otpexpire:Number,

    resetotp:Number,
    resetotpexpire:Number
    
},{timestamps:true});

userSchema.pre("save",async function(next){
    if(this.isModified('password')){
        const salt= await bcrypt.genSalt(10);
        this.password= await bcrypt.hash(this.password,salt);
    }
    next();
})

userSchema.methods.comparePassword=async function(getpassword){
    return await bcrypt.compare(getpassword,this.password);
}

userSchema.methods.getJwt=function(){
    return Jwt.sign({_id:this._id},process.env.JWT_TOKEN)
}


const User= mongoose.model("user",userSchema);
export default User;