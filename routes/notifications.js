const express = require("express")
const router= express.Router()
const usermodel=require("../models/userModel")
const notificationsmodel=require("../models/notificationModel")
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

//create notification
router.post('/',async (req,res)=>{
    let ts =new Date();
    console.log(ts.toString());
    let user =usermodel.findOne({
        userid:req.body.userid
    })
    if(user==null)
    res.status(400).json({message:"User not found"})

    const notification= new notificationsmodel({
        userid:req.body.userid,
        title:req.body.title,
        body:req.body.body,
        isread:false,
        catagory:req.body.catagory,
        date:req.body.date,
        url:req.body.url,
    })
    try{
        let newNotification= await notification.save()
        res.status(201).json({"_id":newNotification.id})
        
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})


//get a notification by id
router.get('/:_id' ,getAddress, (req,res,)=>{
    res.send(res.notif)
})


//get all notification without token
router.get('/getbyuser/:userid',async (req,res)=>{
    console.log(req.params.userid)
    try{
        const notif=await notificationsmodel.find({userid:req.params.userid});
        res.json(notif)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


//update notification
router.patch('/:_id', getAddress,async(req,res)=>{
    console.log( req.params._id);
    if(req.body.isread!=null){
        res.notif.isread=req.body.isread;
    }
    try{
        const updatedNotif=await res.notif.save()
        res.status(201).json({"_id":updatedNotif.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


router.delete("/:_id",async (req,res)=>{
    console.log("Deleting user: "+req.params._id)
    address=await notificationsmodel.findById(req.params._id)
        if(address==null){
            return res.status(404).json({message:"notification unavailable!"})
        }
    try{
        const reasult= await notificationsmodel.deleteOne({_id: new mongodb.ObjectId(req.params._id)})
        res.json(reasult)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getAddress(req,res,next){
    console.log( req.params._id)
    let notif
    try{
        notif=await notificationsmodel.findById( req.params._id)
        if(notif==null){
            return res.status(404).json({message:"address unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.notif=notif
    next()
}
module.exports=router