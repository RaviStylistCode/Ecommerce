import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({

    shippingInfo:{
        address:{
            type:String,
            required:[true,'please enter address'],
            trim:true
        },
        pin:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true,
            trim:true
        },
        state:{
            type:String,
            required:true,
            trim:true
        },
        country:{
            type:String,
            required:true,
            trim:true
        },
        
    },

    productInfo:{
        productId:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true,
            trim:true
        },
        image:{
            type:String,
            required:true,
            trim:true
        },
        quantity:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true,
        }
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },

    payment_Status:{
        type:String,
        default:"processing",
        trim:true
    },

    delivery_charge:{
        type:Number,
        default:0
    },

    deliver_status:{
        type:String,
        default:"placed",
        trim:true
    }

},{timestamps:true});

const order=mongoose.model("order",orderSchema);
export default order;