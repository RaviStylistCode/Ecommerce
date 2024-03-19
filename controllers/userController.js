import User from "../model/userModel.js";
import TryCatch from "../utils/TryCatch.js"
import Errorhandler from "../middlewares/Errorhandler.js";
import sendToken from "../utils/sendToken.js";
import sendMail from "../utils/sendMail.js";
import fs from "fs";
import Order from "../model/orderModel.js";

export const register=TryCatch(async(req,res,next)=>{

    const {name,email,password}=req.body;
    if(!name || !email || !password){
        return next(new Errorhandler("Please enter all fields",400));
    }

    let user= await User.findOne({email});
    if(user){
        return next(new Errorhandler("user already exist",400));
    }

    user = await User.create({
        name,email,password
    });

    sendToken(user,res,"Registered successfully",201);

});

export const login=TryCatch(async(req,res,next)=>{

    const {email,password}=req.body;
    if(!email || !password){
        return next(new Errorhandler("please enter all fields",400));
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new Errorhandler("user does not exist",404));
    }

    const isMatched= await user.comparePassword(password);
    if(!isMatched){
        return next(new Errorhandler("invalid username or password",400));
    }

    sendToken(user,res,`welcome back ${user.name}`,200);
});

export const myprofile=TryCatch(async(req,res,next)=>{
    const user= await User.findById(req.user._id);
    if(!user){
        return next(new Errorhandler("user does not exist",400));
    };

    res.status(200).json({
        success:true,
        message:"My Profile",
        user
    })
});

export const logout=TryCatch((req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now())
    });

    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })
});

export const updateMyProfile=TryCatch(async(req,res,next)=>{

    const {name}=req.body;
    const photo=req.file;
    let user=await User.findById(req.user._id);
    if(!user){
        return next(new Errorhandler("user does not exist",400));
    }

    if(name){
        user.name=name;
    }

    if(photo){
        fs.unlink(user.image,()=>{
            console.log("photo deleted");
        })
        user.image=photo.path;
    }

    await user.save();

    res.status(200).json({
        success:true,
        message:"User Updated",
        user
    })
});

export const updateMyPassword=TryCatch(async(req,res,next)=>{

    let user= await User.findById(req.user._id).select("+password");
    const {oldpassword,newpassword}=req.body;
    if(!oldpassword || !newpassword){
        return next(new Errorhandler("please fill all field",400));
    }
    const isMatched= await user.comparePassword(oldpassword);
    if(!isMatched){
        return next(new Errorhandler("wrong password",400));
    }
    user.password=newpassword;
    await user.save();
    sendToken(user,res,"password updated successfully",204);
});

export const forgetPassword=TryCatch(async(req,res,next)=>{

    const {email}=req.body;
    if(!email){
        return next(new Errorhandler("please enter email",400));
    }
    const user= await User.findOne({email})
    if(!user){
        return next(new Errorhandler("user does not exist",400));
    }

    const otp=Math.floor(Math.random()*1000000);
    user.otp=otp;
    user.otpexpire=new Date(Date.now() + process.env.email_expire * 60 * 1000 );
    await user.save();
    const mailmessage=`Hi ${user.email} !!\n\n Your OTP = ${otp} for Ressetting your password \n\n Thanks you.`;
    await sendMail(user.email,`For Resetting password`,mailmessage);

    res.status(200).json({
        success:true,
        message:`Mail sent to ${user.email} || please check your Email`,
        user
    })
});

export const resetPassword=TryCatch(async(req,res,next)=>{

    const {otp}=req.body;
    if(!otp){
        return next(new Errorhandler("invalid otp",400));
    }
    const getotp = Number(otp);
    const user=await User.findOne({
        otp:getotp,
        otpexpire:{$gt:Date.now()}
    })
    if(!user){
        return next(new Errorhandler("invalid otp or expired",400));
    }

    user.otp=undefined;
    user.otpexpire=undefined;
    await user.save();
    res.status(200).json({
        success:true,
        message:`Ready for Ressetting password`
    })

});

export const Allusers=TryCatch(async(req,res,next)=>{

    const user=await User.find({
        name:{
            $regex:req.query.name || "",
            $options:"i"
        }
    });
    if(!user){
        return next(new Errorhandler("user not found",404));
    }
    res.status(200).json({
        success:true,
        message:"All user",
        user
    })
});

export const adminRegister=TryCatch(async(req,res,next)=>{

    const {name,email,password,role}=req.body;
    if(!name || !email || !password || !role){
        return next(new Errorhandler("please enter all fields",400));
    }

    let user=await User.findOne({email});
    if(user){
        return next(new Errorhandler("user already exist",400));
    }

    user= await User.create({name,email,password,role});
    res.status(201).json({
        success:true,
        message:"Registered Successfully"
    })
});

export const singleUser=TryCatch(async(req,res,next)=>{

    const user=await User.findById(req.params.id);
    if(!user){
        return next(new Errorhandler("user not found",400));
    }
    res.status(200).json({
        success:true,
        message:"Single user",
        user
    });
});

export const updateSingleUser=TryCatch(async(req,res,next)=>{

    const {name,email,role}=req.body;
    const photo=req.file;
    let user= await User.findById(req.params.id);
    if(!user){
        return next(new Errorhandler("user not found",400));
    }

    if(name){
        user.name=name;
    }
    if(email){
        user.email=email;
    }
    if(role){
        user.role=role;
    }
    if(photo){
        fs.unlink(user.image,()=>{
            console.log("deleted")
        });
        user.image=photo.path;
    }

    await user.save();
    res.status(204).json({
        success:true,
        message:" User updated",
        user
    })
});

export const deletemyProfile=TryCatch(async(req,res,next)=>{

    const user=await User.findById(req.user._id);
    const userId=user._id;
    const order=await Order.find({user:userId});
    if(!order){
        await user.deleteOne();
        res.cookie("token",null,{expires:new Date(Date.now())});
        res.status(200).json({
            success:true,
            message:"Account Deleted"
        });
    }else{
        
        for(let i=0;i<order.length;i++){
            const myorder=order[i];
            await myorder.deleteOne();
        }
        await user.deleteOne();
        res.cookie("token",null,{expires:new Date(Date.now())});
        
        res.status(200).json({
            success:true,
            message:"Account Deleted"
        });
    }

});

export const deletesingleUser=TryCatch(async(req,res,next)=>{

    const user = await User.findById(req.params.id);
    const userId=user._id;
    const order = await Order.find({user:userId});
    if(user.role === "admin")return next(new Errorhandler("can't delete admin",400));
    if(!order){
        await user.deleteOne();
        res.status(200).json({
            success:true,
            message:"Account Deleted"
        });
    }else{

        for(let i=0;i<order.length;i++){
            const myorder=order[i];
            await myorder.deleteOne();
        }
        
        await user.deleteOne();
        res.status(200).json({
            success:true,
            message:"Account Deleted"
        })
    }
})

