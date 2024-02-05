const express = require("express")
const router= express.Router()
const invoiceModel=require("../models/invoiceModel")
const companyConsts=require("../models/constsModel")
const mongodb=require("mongodb");
require("dotenv").config()
process.env.TZ = "Asia/Calcutta";
const zeroPad = (num, places) => String(num).padStart(places, '0')

//create transaction
router.post('/',async (req,res)=>{
    let invoicename;
    let cconst;
    if(req.body.type=="Inv"){
        cconst=await companyConsts.findOne({"env":"Prod"})
        if(cconst==null)
            return res.status(404).json({message:"Company Constant Error"})
        invoicename="S/"+zeroPad(cconst.invoice_count, 3)+"/"+cconst.invoice_prefix;
        console.log(invoicename)
    }
    else{
        invoicename=req.body.invoiceId;
    }

    const inv= new invoiceModel({
        invoiceName:req.body.invoiceName,
        userid:req.body.userid,
        invoiceId:invoicename,
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
        orderid:req.body.orderid,
        companyname:req.body.companyname
    })
    try{
        let newInv= await inv.save()
        if(req.body.type=="Inv"){
            cconst.invoice_count=cconst.invoice_count+1
            await cconst.save()
        }
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
        if(req.params.uid=="sendmeallbills")
        {
            inv=await invoiceModel.find()
            console.log("sending all")
        }
        else
            inv=await invoiceModel.find({"userid":req.params.uid})

        if(inv==null){
            return res.status(404).json({message:"no invoice availabe!"})
        }
        
        return res.status(200).json(inv);
        
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

router.get('/byorder/:oid',async(req,res)=>{
    console.log(req.params.uid)
    let inv
    try{
        inv=await invoiceModel.find({"orderid":req.params.oid})
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