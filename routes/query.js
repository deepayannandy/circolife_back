const express = require("express")
const router= express.Router()
const query=require("../models/queryModel")
const mongodb=require("mongodb");
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
    })
    try{
        let newquer= await quer.save()
        res.status(201).json({"_id":newquer.id})
        
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