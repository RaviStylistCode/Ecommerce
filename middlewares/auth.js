import User from "../model/userModel.js";
import TryCatch from "../utils/TryCatch.js";
import Errorhandler from "./Errorhandler.js";
import Jwt from "jsonwebtoken";

export const isAuthenticated=TryCatch(async(req,res,next)=>{

    const {token}=req.cookies;
    if(!token){
        return next(new Errorhandler("Login first",400));
    }

    const decoded= Jwt.verify(token,process.env.JWT_TOKEN);
    req.user= await User.findById(decoded._id);
    next();

})

export const isAdmin=(...role)=>{
    return (req,res,next)=>{
        if(!role.includes(req.user.role)){
            return next(new Errorhandler(`Role : ${req.user.role} is not allowed to access this resource`,400));
        }
        next();
    }
}