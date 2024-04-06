import app from "./app.js";
import dotenv from "dotenv"
import connectDB from "./database/database.js";
import {v2 as cloudinary} from "cloudinary"

dotenv.config({
    path:"./config.env"
});

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

connectDB();


app.listen(process.env.PORT,()=>{
    console.log(`server running on http://localhost:${process.env.PORT}`)
})