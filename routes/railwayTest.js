const express = require("express")
const router= express.Router()
const railwayModel=require("../models/railwayTestModel")
const mongodb=require("mongodb");
require("dotenv").config()

process.env.TZ = "Asia/Calcutta";

//create transaction
router.post('/',async (req,res)=>{
    let ts =new Date();
    console.log(ts.toString());
    const trans= new railwayModel({
        deviceMac:req.body.deviceMac,
        STB1_05_XMVBLifeSig:req.body.STB1_05_XMVBLifeSig,
        STB1_01_LActKSwD:req.body.STB1_01_LActKSwD,
        FLG1_07_XNodeMSC:req.body.FLG1_07_XNodeMSC,
        LAT:req.body.LAT,
        LON:req.body.LON,
        HBB2_31_LPanUpw_ish:req.body.HBB2_31_LPanUpw_ish,
        HBB2_31_LPanDnish:req.body.HBB2_31_LPanDnish,
        SLG1_XTempMotor1_Convert:req.body.SLG1_XTempMotor1_Convert,
        SLG1_XTempMotor2_Convert:req.body.SLG1_XTempMotor2_Convert,
        G1_XTempMotorB_Convert:req.body.G1_XTempMotorB_Convert,
        SLG1_XTempoilConv1_Convert:req.body.SLG1_XTempoilConv1_Convert,
        BUR2_X73_Battery_Vol:req.body.BUR2_X73_Battery_Vol,
        BUR2_XUFWR:req.body.BUR2_XUFWR,
        BUR2_XUUZ:req.body.BUR2_XUUZ,
        BUR3_XUFWR:req.body.BUR3_XUFWR,
    })
    try{
        let newTrans= await trans.save()
        res.status(201).json({"_id":newTrans.id})
        
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

module.exports=router