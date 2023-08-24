const express = require("express")
const router= express.Router()
const usermodel=require("../models/userModel")
const validator= require("../validators/validation")
const nodemailer = require('nodemailer');
const mongodb=require("mongodb");
require("dotenv").config()
process.env.TZ = "Asia/Calcutta";
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'appsdny@gmail.com',
    pass: process.env.MAILER_PASS,
  },
  port:465,
  host:"smtp.gmail.com"
});

const verifie_token= require("../validators/verifyToken")

//create user
router.post('/register',async (req,res)=>{
    let ts =new Date();
    //validate the data
    const valid=validator.resistration_validation(req.body);
    if(valid.error){
        return res.status(400).send(valid.error.details[0].message);
    }
    const email_exist=await usermodel.findOne({email:req.body.email});
    if(email_exist) return res.status(400).send({"message":"Email already exist!"});
    
    console.log(ts.toString());
    const user= new usermodel({
        Fullname:req.body.Fullname,
        mobile:req.body.mobile,
        email:req.body.email,
        onBoardingDate:ts,
        userid:req.body.userid,
        longitude:req.body.longitude,
        latitude:req.body.latitude,
        address:req.body.address,
        state:req.body.state,
        city:req.body.city,
        pincode:req.body.pincode,
        area:req.body.area,
        flat:req.body.flat,
        kycStatus:false,
        kycid:"",
        devices:[],
    })
    try{
        const newUser=await user.save()
        var regestereduserMail = {
            from: 'appsdny@gmail.com',
            to: req.body.email,
            subject: 'Hello👋 Welcome to CircoLife ',
            text: `Hi ${req.body.Fullname},
Congratulations on your successful registration at CircoLife. 
Thank you 
Team CircoLife`      
          };
          transporter.sendMail(regestereduserMail, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        
        res.status(201).json({"_id":newUser.id})
        
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})


//get a user by mobile number
router.get('/:mob' ,getUser, (req,res,)=>{
    res.send(res.user)
})

//get all user
router.get('/',async (req,res)=>{
    const user=await usermodel.findOne({_id:req.tokendata._id});
    if(!user) return res.status(400).send({"message":"User dose not exist!"});
    console.log(user.UserBranch)
    try{
        const users=await usermodel.find({UserBranch:user.UserBranch});
        res.json(users)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})
//get all user without token
router.get('/getall/get',async (req,res)=>{
    try{
        const users=await usermodel.find();
        res.json(users)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


//update user
router.patch('/:id',verifie_token, getUser,async(req,res)=>{
    console.log(req.tokendata.UserType);
    if(req.body.Fullname!=null){
        res.user.Fullname=req.body.Fullname;
    }
    if(req.body.email!=null){
        res.user.email=req.body.email;
    }
    if(req.body.devices!=[] && req.body.devices!=null){
        res.user.devices= res.user.devices.push(req.body.devices);
    }
    try{
        const newUser=await res.user.save()
        res.status(201).json({"_id":newUser.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


router.delete("/:id",async (req,res)=>{
    console.log("Deleting user: "+req.params.id)
    user=await usermodel.findById(req.params.id)
        if(user==null){
            return res.status(404).json({message:"User unavailable!"})
        }
    try{
        const reasult= await usermodel.deleteOne({_id: new mongodb.ObjectId(req.params.id)})
        res.json(reasult)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getUser(req,res,next){
    let user
    try{
        user=await usermodel.findOne({mobile: req.params.mob})
        if(user==null){
            return res.status(404).json({message:"User unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.user=user
    next()
}
module.exports=router