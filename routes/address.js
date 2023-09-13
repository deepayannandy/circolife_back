const express = require("express")
const router= express.Router()
const usermodel=require("../models/userModel")
const addressmodel=require("../models/addressModel")
const nodemailer = require('nodemailer');
const mongodb=require("mongodb");
require("dotenv").config()

process.env.TZ = "Asia/Calcutta";
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'appsdny@gmail.com',
    pass: process.env.MAILER_PASS,
  },
  port:465,
  host:"smtp.gmail.com"
});

//create address
router.post('/',async (req,res)=>{
    let ts =new Date();
    console.log(ts.toString());
    let user =usermodel.findOne({
        userid:req.body.userid
    })
    if(user==null)
    res.status(400).json({message:"User not found"})

    const order= new addressmodel({
        userid:req.body.userid,
        longitude:req.body.longitude,
        latitude:req.body.latitude,
        address:req.body.address,
        state:req.body.state,
        city:req.body.city,
        pincode:req.body.pincode,
        area:req.body.area,
        flat:req.body.flat,
    })
    try{
        let newAddress= await order.save()
        res.status(201).json({"_id":newAddress.id})
        
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})


//get a address by id
router.get('/:_id' ,getAddress, (req,res,)=>{
    res.send(res.address)
})


//get all user without token
router.get('/getbyuser/:userid',async (req,res)=>{
    console.log(req.params.userid)
    try{
        const address=await addressmodel.find({userid:req.params.userid});
        res.json(address)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


//update user
router.patch('/:_id', getAddress,async(req,res)=>{
    console.log( req.params._id);

    if(req.body.area!=null){
        res.address.area=req.body.area;
    }
    if(req.body.flat!=null){
        res.address.flat=req.body.flat;
    }
    if(req.body.address!=null){
        res.address.address=req.body.address;
    }
    
    if(req.body.state!=null){
        res.address.state=req.body.state;
    }
    
    if(req.body.city!=null){
        res.address.city=req.body.city;
    }
    
    if(req.body.pincode!=null){
        res.address.pincode=req.body.pincode;
    }
    
    try{
        const newAddress=await res.address.save()
        res.status(201).json({"_id":newAddress.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


router.delete("/:_id",async (req,res)=>{
    console.log("Deleting user: "+req.params._id)
    address=await addressmodel.findById(req.params._id)
        if(address==null){
            return res.status(404).json({message:"address unavailable!"})
        }
    try{
        const reasult= await addressmodel.deleteOne({_id: new mongodb.ObjectId(req.params._id)})
        res.json(reasult)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getAddress(req,res,next){
    console.log( req.params._id)
    let address
    try{
        address=await addressmodel.findById( req.params._id)
        if(address==null){
            return res.status(404).json({message:"address unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.address=address
    next()
}
module.exports=router