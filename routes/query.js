const express = require("express")
const router= express.Router()
const query=require("../models/queryModel")
const mongodb=require("mongodb");
const notificationsmodel=require("../models/notificationModel")
require("dotenv").config()

process.env.TZ = "Asia/Calcutta";

//create transaction
router.post('/',async (req,res)=>{
    let ts =new Date();
    console.log(ts.toString());
    const quer= new query({
        userid:req.body.userid,
        contactperson:req.body.contactperson,
        contactnumber:req.body.contactnumber,
        contactemail:req.body.contactemail,
        image:req.body.image,
        subject:req.body.subject,
        summery:req.body.summery,
        type:req.body.type,
        status:req.body.status,
        TimeStamp:ts,
        deviceid:req.body.deviceid,
    })
    const notification= new notificationsmodel({
        userid:req.body.userid,
        title:"We have received your request!",
        body:"One of our agent will contact with you shortly.",
        isread:false,
        catagory:"Query",
        date:ts,
    })
    try{
        let newquer= await quer.save()
        let newNotification= await notification.save()
        res.status(201).json({"_id":newquer.id,"notification_id":newNotification.id})
        
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})
router.get('/:id',async (req,res)=>{
    try{
        const queries=await query.find({userid: req.params.id});
        res.json(queries)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


module.exports=router