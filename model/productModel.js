import mongoose from "mongoose";

const productSchema=new mongoose.Schema({

    name:{
        type:String,
        trim:true,
        required:[true,'enter name of product']
    },
    title:{
        type:String,
        trim:true,
        required:[true,'enter title of product']
    },
    description:{
        type:String,
        trim:true,
        required:[true,'enter description of product']
    },
    category:{
        type:String,
        required:[true,'please enter product category'],
        trim:true
    },

    stock:{
        type:Number,
        default:0
    },

    image:{
        type:String,
        default:"asdfh",
        required:[true,'please add an image']
    },

    price:Number,

    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:"user"
    },

    review:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"user"
        },
        message:{
            type:String
        }
    }],

    numOfView:{
        type:Number,
        default:0
    }

},{timestamps:true});

const Product= mongoose.model("product",productSchema);
export default Product;