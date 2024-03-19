import Errorhandler from "./Errorhandler.js";

export default (err,req,res,next)=>{
    err.statusCode ||= 500;
    err.message ||= "Internal Server Error";

    if(err.message == "CastError"){
        const message="Resource not found "+err.path;
       err=new Errorhandler(message,400);
    }

    if(err.message =="11000"){
        const message="Duplicate key entered "+err.path;
        err=new Errorhandler(message,400);
    }


    res.status(err.statusCode).json({
        success:false,
        message:err.message,
        stack:err.stack
    })
}