const express = require("express")
const router= express.Router()
const transaction=require("../models/transactionModel")
const mongodb=require("mongodb");
require("dotenv").config()

process.env.TZ = "Asia/Calcutta";

//create transaction
router.post('/',async (req,res)=>{
    let ts =new Date();
    console.log(ts.toString());
    const trans= new transaction({
        userid:req.body.userid,
        success:req.body.success,
        code:req.body.code,
        data:req.body.data,
        TimeStamp:ts,
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