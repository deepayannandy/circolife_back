const express = require("express")
const router= express.Router()
const invoiceModel=require("../models/invoiceModel")
const mongodb=require("mongodb");
require("dotenv").config()
process.env.TZ = "Asia/Calcutta";


//create transaction
router.post('/',async (req,res)=>{
    const inv= new invoiceModel({
        invoiceName:req.body.invoiceName,
        userid:req.body.userid,
        invoiceId:req.body.invoiceId,
        invoiceDate:req.body.invoiceDate,
        DueDate:req.body.DueDate,
        recipientname:req.body.recipientname,
        recipientshippingaddress:req.body.recipientshippingaddress,
        recipientBillingaddress:req.body.recipientBillingaddress,
        recipientgst:req.body.recipientgst,
        statecode:req.body.statecode,
        place_supply:req.body.place_supply,
        items:req.body.items,
        state:req.body.state,
        transactionId:req.body.transactionId,
        type:req.body.type,
    })
    try{
        let newInv= await inv.save()
        res.status(201).json({"_id":newInv.id})
        
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})
router.get('/:uid',async(req,res)=>{
    console.log(req.params.uid)
    let inv
    try{
        inv=await invoiceModel.find({"userid":req.params.uid})
        if(inv==null){
            return res.status(404).json({message:"no invoice availabe!"})
        }
        else{
            return res.status(200).json(inv);
        }   
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})
module.exports=router