
const sendToken=(user,res,message,statusCode)=>{

    const token = user.getJwt();
    const option={
        httpOnly:true,
        maxAge:process.env.JWT_EXPIRY * 24 * 60 * 60 * 1000
    }

    res.status(statusCode).cookie("token",token,option).json({
        success:true,
        message,
        user,
        token
    })
}

export default sendToken;