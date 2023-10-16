const express = require("express")
const router= express.Router()
const usermodel=require("../models/userModel")
const ordermodel=require("../models/orderModel")
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

//create user
router.post('/',async (req,res)=>{
    console.log(req.body.userid)
    let order_user =await usermodel.findOne({
        userid:req.body.userid
    })
    if (order_user==null){
        res.status(400).json({message:"User not available"})
    }
    else{
        console.log(order_user)
    }
    const order= new ordermodel({
        Fullname:order_user.Fullname,
        mobile:order_user.mobile,
        email:order_user.email,
        userid:req.body.userid,
        longitude:req.body.longitude,
        latitude:req.body.latitude,
        address:req.body.address,
        state:req.body.state,
        city:req.body.city,
        pincode:req.body.pincode,
        area:req.body.area,
        flat:req.body.flat,
        Status:"Ordered",
        orderingDate:req.body.orderingDate,
        appointmentDate:req.body.appointmentDate,
        model:req.body.model,
        plan_year:req.body.plan_year,
        paymentId:req.body.paymentId,
        payment_amount:req.body.payment_amount,
        is_kyc_neede:order_user.kycStatus==true?false:true,

    })
    const notification= new notificationsmodel({
        userid:req.body.userid,
        title:"Congratulation you booking is confirmed 😊",
        body:"Sir we are processing your order and it will be delivered and installed",
        isread:false,
        catagory:"support",
        date:req.body.orderingDate,
    })
    try{
        const newOrder=await order.save()
        let newNotification= await notification.save()
//         var regestereduserMail = {
//             from: 'appsdny@gmail.com',
//             to: req.body.email,
//             subject: 'Hello👋 Welcome to CircoLife ',
//             text: `Hi ${req.body.Fullname},
// Congratulations on your successful registration at CircoLife. 
// Thank you 
// Team CircoLife`      
//           };
//           transporter.sendMail(regestereduserMail, function(error, info){
//             if (error) {
//               console.log(error);
//             } else {
//               console.log('Email sent: ' + info.response);
//             }
//           });
        
        res.status(201).json({"_id":newOrder.id})
        
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})




//get all orders by user
router.get('/getbyuser/:uid',async (req,res)=>{
    console.log(req.params.uid)
    try{
        const orders=await ordermodel.find({userid:req.params.uid});
        res.json(orders)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


//update user
router.patch('/:id', getUser,async(req,res)=>{
    console.log(req.tokendata.UserType);
    if(req.body.Fullname!=null){
        res.user.Fullname=req.body.Fullname;
    }
    if(req.body.email!=null){
        res.user.email=req.body.email;
    }
    if(req.body.devices!=[] && req.body.devices!=null){
        res.user.devices= res.user.devices.push(req.body.devices);
    }
    try{
        const newUser=await res.user.save()
        res.status(201).json({"_id":newUser.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


router.delete("/:id",async (req,res)=>{
    console.log("Deleting user: "+req.params.id)
    user=await usermodel.findById(req.params.id)
        if(user==null){
            return res.status(404).json({message:"User unavailable!"})
        }
    try{
        const reasult= await usermodel.deleteOne({_id: new mongodb.ObjectId(req.params.id)})
        res.json(reasult)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getUser(req,res,next){
    let user
    try{
        user=await usermodel.findOne({mobile: req.params.mob})
        if(user==null){
            return res.status(404).json({message:"User unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.user=user
    next()
}
module.exports=router