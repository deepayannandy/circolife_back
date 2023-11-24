const express = require("express")
const router= express.Router()
const devices=require("../models/deviceModel")
const mongodb=require("mongodb");
require("dotenv").config()

process.env.TZ = "Asia/Calcutta";

//create transaction
router.post('/',async (req,res)=>{
    const newdevices= new devices({
        userid:req.body.userid,
        deviceid:req.body.deviceid,
        deviceName:req.body.deviceName,
        isShared:req.body.isShared,
        isadmin:req.body.isadmin,
        receiversid:req.body.receiversid,
        sendersName:req.body.sendersName,
        receiversName:req.body.receiversName,
    })
    try{
        let newDevice= await newdevices.save()
        res.status(201).json({"_id":newDevice.id})
        
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})
router.get('/',async (req,res)=>{
    try{
        const deviceS=await devices.find();
        res.json(deviceS)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/:id',async (req,res)=>{
    try{
        const deviceS=await devices.find({userid: req.params.id});
        res.json(deviceS)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports=router