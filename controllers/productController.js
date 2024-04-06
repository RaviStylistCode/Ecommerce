import Product from "../model/productModel.js";
import User from "../model/userModel.js";
import TryCatch from "../utils/TryCatch.js";
import Errorhandler from "../middlewares/Errorhandler.js";
import fs from "fs";
import Cloudinary from "cloudinary";
import getdaturi from "../utils/datauri.js";


export const newProduct=TryCatch(async(req,res,next)=>{

    const {name,title,description,category,stock,price}=req.body;
    const photo=req.file;
    console.log(photo)
    const fileUri=getdaturi(photo);
    // console.log(fileUri.content);
    const myimg=await Cloudinary.v2.uploader.upload(fileUri.content);
    // if(!name || !title || !description || !category || stock || !price || !photo){
    //     return next(new Errorhandler("All fields required",400));
    // }

    const product = await Product.create({
        name,title,description,category,createdBy:req.user._id,stock,price,image:myimg.secure_url
    })

    // console.log(photo)
    res.status(201).json({
        success:true,
        message:"Product Created",
        product
    })
});

export const singleProduct=TryCatch(async(req,res,next)=>{

    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new Errorhandler("product not found",400));
    }
    product.numOfView += 1;
    await product.save();
    res.status(200).json({
        success:true,
        message:"single product",
        product
    })
})

export const allProduct = TryCatch(async(req,res,next)=>{

    const product=await Product.find({
        name:{
            $regex:req.query.name || "",
            $options:"i"
        }
    });

    if(!product){
        return next(new Errorhandler("product not found",400));
    }

    res.status(200).json({
        success:true,
        message:"Products",
        product
    })
});


export const updateProduct=TryCatch(async(req,res,next)=>{

    let product=await Product.findById(req.params.id);
    if(!product){
        return next(new Errorhandler("product not found",400));
    }

    const {name,title,description,price,stock,category}=req.body;
    const photo=req.file;
    if(name){
        product.name=name;
    }
    if(title){
        product.title=title;
    }
    if(description){
        product.description=description;
    }
    if(price){
        product.price=price;
    }
    if(stock){
        product.stock=stock;
    }
    if(category){
        product.category=category;
    }
    if(photo){
        fs.unlink(product.image,()=>{
            console.log("deleted");
        });
        product.image=photo.path;
    }

    await product.save();

    res.status(200).json({
        success:true,
        message:"product updated",
        product
    })

});


export const deleteProduct=TryCatch(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
        return next(new Errorhandler("product not found",400));
    }

    if(product.createdBy.toString() !== req.user._id.toString()){
        return next(new Errorhandler("Unauthorized User",401));
    }
    await product.deleteOne();
    res.status(200).json({
        success:true,
        message:"product deleted"
    });
});

export const deleteallproducts=TryCatch(async(req,res,next)=>{

    const products=await Product.find();
    if(!products){
        return next(new Errorhandler("products not found",400));
    }

    let product;
    for(let i=0;i<products.length;i++){
        product=products[i];
        await product.deleteOne();
    }

    res.status(200).json({
        success:true,
        message:"Deleted all products",
        product
    })
});

export const addtoCart=TryCatch(async(req,res,next)=>{

    let user= await User.findById(req.user._id);
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new Errorhandler("product not found",400));
    }
    user.cart.push(product._id);
    await user.save();

    res.status(200).json({
        success:true,
        message:"product added to cart",
        user,
        product
    })
});

export const productCreatedByMe=TryCatch(async(req,res,next)=>{

    let product = await Product.find();
    if(!product){
        return next(new Errorhandler("product not found",400));
    }

    const userProduct=product.filter((item)=>item.createdBy.toString() == req.user._id);
    if(!userProduct){
        return next(new Errorhandler("not found",400));
    }

    res.status(200).json({
        success:true,
        message:"product created By me",
        product:userProduct
    })
    
});

export const reviewProduct=TryCatch(async(req,res,next)=>{

    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new Errorhandler("product not found",400));
    }

    const {message}=req.body;
    if(!message){
        return next(new Errorhandler("please enter message",400));
    }
    const review={
        user:req.user._id,
        message
    }
    product.review.push(review);
    await product.save();
    res.status(200).json({
        success:true,
        message:"reviewed product"
    });
});

export const allcartproduct=TryCatch(async(req,res,next)=>{

    const user =await User.findById(req.user._id);
    const product=user.cart;

    res.status(200).json({
        success:true,
        message:"All Cart",
        product
    })

});


export const getlatestproduct=TryCatch(async(req,res,next)=>{

    const product=await Product.find({}).sort({createdAt:-1}).limit(5);
    res.status(200).json({
        success:true,
        message:"latest products",
        product
    });
});


export const getCategories=TryCatch(async(req,res,next)=>{
    const product= await Product.distinct("category");
    res.status(200).json({
        success:true,
        message:"Categories",
        product
    })
})