const express = require("express")
const router= express.Router()
const companyConst=require("../models/constsModel")


router.post('/',async (req,res)=>{
    const newConst= new companyConst({
        env:req.body.env,
        invoice_prefix:req.body.invoice_prefix,
        invoice_count:req.body.invoice_count,
    })
    try{
        let newC= await newConst.save()
        res.status(201).json({"_id":newC.id})
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})
module.exports=router