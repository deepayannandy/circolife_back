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
        receiversNumber:req.body.receiversNumber,
        receiversImage:req.body.receiversImage,
        sendersImage:req.body.sendersImage,
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
router.get('/shared/:id',async (req,res)=>{
    try{
        const deviceS=await devices.find({receiversid: req.params.id});
        res.json(deviceS)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.patch('/:id', getDevice,async(req,res)=>{
    if(req.body.deviceName!=null){
        res.dev.deviceName=req.body.deviceName;
    }
    if(req.body.isadmin!=null){
        res.dev.isadmin=req.body.isadmin;
    }
    try{
        const newDev=await res.dev.save()
        res.status(201).json({"_id":newDev.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.delete("/:id",async (req,res)=>{
    console.log("Deleting Device: "+req.params.id)
    dev=await devices.findById(req.params.id)
        if(dev==null){
            return res.status(404).json({message:"Device unavailable!"})
        }
    try{
        const reasult= await devices.deleteOne({_id: new mongodb.ObjectId(req.params.id)})
        res.json(reasult)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getDevice(req,res,next){
    let dev
    try{
        dev=await devices.findById(req.params.id)
        if(dev==null){
            return res.status(404).json({message:"User unavailable!"})
        }
    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.dev=dev
    next()
}

module.exports=router