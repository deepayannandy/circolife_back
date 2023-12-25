const express = require("express")
const router= express.Router()
const devicePaymentsmodel=require("../models/devicePaymentsModel")
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
    let order_data =await ordermodel.findOne({
        _id:req.body.orderid
    })
    if (order_data==null){
        res.status(400).json({message:"Order not available"})
    }
    else{
        console.log(order_user)
    }
    const devicepayment= new devicePaymentsmodel({
        orderid:req.body.orderid,
        deviceid:order_data.deviceId,
        subsEndDate:req.body.subsEndDate,
        ispaid:false,
        paidAmount:order_data.monthlyPayment_amount,
    })
    try{
        const newDP=await devicepayment.save()
        res.status(201).json({"_id":newDP.id})
        
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//get all orders by user
router.get('/getbydevice/:did',async (req,res)=>{
    console.log(req.params.did)
    try{
        const devicepayments=await devicePaymentsmodel.find({deviceid:req.params.did});
        res.json(devicepayments)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


//update user
router.patch('/completePayment/:id', getDevicePayment,async(req,res)=>{
    let order_data =await ordermodel.findOne({
        _id:res.devicePayment.orderid
    })
    if (order_data==null){
        res.status(400).json({message:"Order not available"})
    }
    res.devicePayment.ispaid=req.body.ispaid;
    res.devicePayment.paidDate=req.body.paidDate;
    res.devicePayment.transactionID=req.body.transactionID;
    res.devicePayment.paidAmount=req.body.paidAmount;
    var future=new Date(res.devicePayment.subsEndDate);
    console.log(future)
    future.setDate(future.getDate() + 30);
    console.log(future)
    order_data.payment_count=order_data.payment_count-1
    const devicepayment= new devicePaymentsmodel({
        orderid:res.devicePayment.orderid,
        deviceid:res.devicePayment.deviceid,
        subsEndDate:future,
        ispaid:false,
        paidAmount:res.devicePayment.paidAmount,
        paymentcount:res.devicePayment.paymentcount+1,
    })
    try{
        const newdevicePayment=await devicepayment.save()
        const olddevicePayment=await res.devicePayment.save()
        const savedorder= await order_data.save()
        res.status(201).json({"old_id":olddevicePayment.id,"new_id":newdevicePayment._id,"updated_order_id":savedorder._id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})



//middleware
async function getDevicePayment(req,res,next){
    let dp
    try{
        dp=await devicePaymentsmodel.findById(req.params.id)
        if(dp==null){
            return res.status(404).json({message:"Device Payment unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.devicePayment=dp
    next()
}
module.exports=router