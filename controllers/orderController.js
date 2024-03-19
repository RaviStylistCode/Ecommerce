import Order from "../model/orderModel.js";
import TryCatch from "../utils/TryCatch.js";
import Errorhandler from "../middlewares/Errorhandler.js";

export const createOrder=TryCatch(async(req,res,next)=>{

    const {shippingInfo,productInfo}=req.body;
    if(!shippingInfo || !productInfo){
        return next(new Errorhandler("All fileds mendatory",400));
    }
    const order = await Order.create({
        shippingInfo,
        productInfo,
        user:req.user._id
    });

    res.status(200).json({
        success:true,
        message:"order placed",
        order
    });
});

export const myallOrders=TryCatch(async(req,res,next)=>{

    const order=await Order.find({user:req.user._id});
    if(!order){
        return next(new Errorhandler("order not found",404));
    }
    // const myOrders=order.map((item)=>item.user.toString() == req.user._id.toString());
    // if(!myOrders){
    //     return next(new Errorhandler("You have no order",404));
    // }

    res.status(200).json({
        success:true,
        message:"My All Orders",
        order
    })
});

export const allOrders=TryCatch(async(req,res,next)=>{

    const order=await Order.find().populate("user");
    if(!order){
        return next(new Errorhandler("Order not found",404));
    }
    
    res.status(200).json({
        success:true,
        message:"All Orders",
        order
    })

});

export const singleOrder=TryCatch(async(req,res,next)=>{

    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new Errorhandler("Order not found",400));
    }
    res.status(200).json({
        success:true,
        message:"Single Order",
        order
    });
});

export const updateOrder=TryCatch(async(req,res,next)=>{

    const {shippingInfo,productInfo}=req.body;
    let order=await Order.findById(req.params.id);
    if(!order){
        return next(new Errorhandler("order not found",400));
    }

    if(shippingInfo){
        order.shippingInfo=shippingInfo;
    }

    if(productInfo){
        order.productInfo=productInfo;
    }

    await order.save();
    res.status(200).json({
        success:true,
        message:"order updated",
        order
    })

});

export const deletesingleOrder=TryCatch(async(req,res,next)=>{

    const order= await Order.findById(req.params.id);
    if(!order){
        return next(new Errorhandler("order not found",400));
    }

    if(order.user.toString() !== req.user._id.toString()){
        return next(new Errorhandler("Unauthorized User",401));
    }

    await order.deleteOne();
    res.status(200).json({
        success:true,
        message:"Order deleted"
    });
});

export const adminSingleOrderdelete=TryCatch(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new Errorhandler("order not found",400));
    }
    await order.deleteOne();

    res.status(200).json({
        success:true,
        message:"order deleted"
    });
});

export const adminSingleOrderUpdate=TryCatch(async(req,res,next)=>{

    const {deliver_status}=req.body;
    const order = await Order.findById(req.params.id);
    if(deliver_status === "placed"){
        order.deliver_status="Dispatched";
    }else if(deliver_status ==="Dispatched"){
        order.deliver_status="Delivered";
    }else{
        return next(new Errorhandler("order already delivered",400));
    }
    await order.save();

    res.status(200).json({
        success:true,
        message:"Deliver status updated",
        order
    });
});


export const getadminsingleorder=TryCatch(async(req,res,next)=>{

    const order= await Order.findById(req.params.id).populate("user");
    res.status(200).json({
        success:true,
        message:"Single admin order route",
        order
    });
});

export const getdeleteallorders=TryCatch(async(req,res,next)=>{

    const order=await Order.find();
    if(!order){
        return next(new Errorhandler("order not found",400));
    };
    
    for(let i=0;i<order.length;i++){
        const myorders=order[i];
        await myorders.deleteOne();
    }

    return res.status(200).json({
        success:true,
        message:"All orders deleted"
    })
})