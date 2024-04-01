import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

const app=express();

import errormiddleware from "./middlewares/error.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import orderRoute from "./routes/orderRoute.js";


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1/users",userRoute);
app.use("/api/v1/products",productRoute);
app.use("/api/v1/orders",orderRoute);
app.use("/uploads",express.static('uploads'))

app.use(errormiddleware);

export default app;