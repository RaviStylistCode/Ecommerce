import app from "./app.js";
import dotenv from "dotenv"
import connectDB from "./database/database.js";
import {v2 as cloudinary} from "cloudinary"

dotenv.config({
    path:"./config.env"
});

cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.cloud_api,
    api_secret:process.env.cloud_secret
});

connectDB();


app.listen(process.env.PORT,()=>{
    console.log(`server running on http://localhost:${process.env.PORT}`)
})