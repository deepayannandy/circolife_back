const express = require("express")
const router= express.Router()
const usermodel=require("../models/userModel")
const ordermodel=require("../models/orderModel")
const notificationsmodel=require("../models/notificationModel")
const Device_payment_model=require("../models/devicePaymentsModel")
const nodemailer = require('nodemailer');
const mongodb=require("mongodb");
require("dotenv").config()
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'info@circolife.com',
      pass: process.env.MAILER_PASS,
    },
    port:465,
    host:"smtp.gmail.com"
  });
  
  var maillist = [
    'vigyan.pathak@circolife.com',
    'ganesh.kumbhar@circolife.com',
    'vijay.satle@circolife.com',
    'vijay.satle@circolife.com',
  ];
  var cclist = [
    'tushar@circolife.com',
    'abhishek@circolife.com',
    'ashish@circolife.com',
    'saurav.agrawal@circolife.com',
    'devanshu@circolife.com'
  ];
  var cclistService = [
    'tushar@circolife.com',
  ];
  var bcclist = [
    'dnyindia@gmail.com',
  ];

process.env.TZ = "Asia/Calcutta";


//create user
router.post('/',async (req,res)=>{
    console.log(req.body.userid)
    let order_user =await usermodel.findOne({
        userid:req.body.userid
    })
    if (order_user==null){
        res.status(400).json({message:"User not available"})
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
        monthlyPayment_amount:req.body.monthlyPayment_amount,
        companyname:req.body.companyname,
        gst:req.body.gst,
        billingaddress:req.body.billingaddress,
        remainingBalance:req.body.remainingBalance

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
        var orderUserUpdateMail = {
            from: 'info@circolife.com',
            to: order_user.email,
            subject: 'Wohoo Order Placed Successfully 🎉 ',
            text: `Hello ${req.body.Fullname},
Congratulations on you have successful placed an order at CircoLife. 

Your ${req.body.model} AC will be installed by ${req.body.appointmentDate.split(" ")[0].split("T")[0]}
Transaction Id: ${req.body.paymentId}
Order Id: ${newOrder.id}.

Regards
Team CircoLife`      
          };
          transporter.sendMail(orderUserUpdateMail, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          var orderUpdateMail = {
            from: 'info@circolife.com',
            to: maillist,
            cc:cclist,
            bcc:bcclist,
            subject: `New Subscription Notification: ${order_user.Fullname} Has Joined Circolife!`, 
            text:`Dear Circolife Team,

We're excited to announce that ${order_user.Fullname} has just subscribed to Circolife through our app! 🎉
            
Here are the details of their subscription:
            
Name: ${order_user.Fullname}
Phone: ${order_user.mobile}
Tonnage: ${req.body.model}
No. of AC's:  1
Date of Installation :  ${req.body.appointmentDate.split(" ")[0].split("T")[0]}
Address: ${req.body.address}, ${req.body.flat}, ${req.body.city}, ${req.body.state}, ${req.body.pincode}
            
Duration:  ${req.body.plan_year} Year(s)
Paid Amount: ${req.body.payment_amount}
Remaining Amount: ${req.body.remainingBalance}
Installation Charge: 1500
Subscription Fee : ${req.body.monthlyPayment_amount} /Month
            
Let's gear up to provide the best ever experience to ${order_user.Fullname} with our CircoLife way. 
            
Best regards,
CircoLife Intelligent App`
        }
          transporter.sendMail(orderUpdateMail, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        
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

router.patch('/:id', getOrder,async(req,res)=>{
    if(req.body.remainingBalance!=null){
        res.order.remainingBalance=req.body.remainingBalance;
    }
    if(req.body.paymentId!=null){
        res.order.paymentId=res.order.paymentId+","+req.body.paymentId;
    }
    if(req.body.payment_amount!=null){
        res.order.payment_amount=res.order.payment_amount+req.body.payment_amount;
    }
    try{
        const newOrder=await res.order.save()
        res.status(201).json({"Update_id":newOrder.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//update user
router.patch('/completeorder/:id', getOrder,async(req,res)=>{
    res.order.Status=req.body.Status;
    res.order.payment_count=(res.order.plan_year*12)-1;
    res.order.deviceId=req.body.deviceId;
    const devicepayment= new Device_payment_model({
        orderid:res.order._id,
        deviceid:req.body.deviceId,
        subsEndDate:req.body.subsEndDate,
        ispaid:false,
        paidAmount:res.order.monthlyPayment_amount,
        paymentcount:2,
    })
    try{
        const newOrder=await res.order.save()
        const newDevicePayment= await devicepayment.save()
        res.status(201).json({"Update_id":newOrder.id,"DivPay_id":newDevicePayment.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


router.delete("/:id",async (req,res)=>{
    console.log("Deleting order: "+req.params.id)
    user=await ordermodel.findById(req.params.id)
        if(user==null){
            return res.status(404).json({message:"Order unavailable!"})
        }
    try{
        const reasult= await ordermodel.deleteOne({_id: new mongodb.ObjectId(req.params.id)})
        res.json(reasult)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getOrder(req,res,next){
    let order
    try{
        order=await ordermodel.findById(req.params.id)
        if(order==null){
            return res.status(404).json({message:"Order unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.order=order
    next()
}
module.exports=router