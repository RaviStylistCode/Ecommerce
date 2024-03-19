import app from "./app.js";
import dotenv from "dotenv"
import connectDB from "./database/database.js";

dotenv.config({
    path:"./config.env"
})

connectDB();


app.listen(process.env.PORT,()=>{
    console.log(`server running on http://localhost:${process.env.PORT}`)
})