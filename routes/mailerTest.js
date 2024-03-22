const express = require("express")
const router= express.Router()
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'info@circolife.com',
      pass: process.env.MAILER_PASS,
    },
    port:465,
    host:"smtp.gmail.com"
  });
  
  var maillist = [
    'vigyan.pathak@circolife.com',
    'ganesh.kumbhar@circolife.com',
    'vijay.satle@circolife.com',
    'vijay.satle@circolife.com',
  ];
  var cclist = [
    'tushar@circolife.com',
    'abhishek@circolife.com',
    'ashish@circolife.com',
    'saurav.agrawal@circolife.com',
    'devanshu@circolife.com'
  ];
  var cclistService = [
    'tushar@circolife.com',
  ];
  var bcclist = [
    'dnyindia@gmail.com',
  ];

router.post('/sendOrder',async (req,res)=>{
    try{
        var regestereduserMail = {
            from: 'appsdny@gmail.com',
            to: maillist,
            cc:cclist,
            bcc:bcclist,
            subject: `New Subscription Notification: ${req.body.username} Has Joined Circolife!`, 
            text:`Dear Circolife Team,

We're excited to announce that ${req.body.username} has just subscribed to Circolife through our app! 🎉
            
Here are the details of their subscription:
            
Name: ${req.body.username}
Phone: ${req.body.mobile}
Tonnage: ${req.body.model}
No. of AC's:  ${req.body.ordercount}
Date of Installation :  ${req.body.dateofinstallation}
Address: ${req.body.address}
            
Duration:  ${req.body.duration}
Deposit: ${req.body.deposit}
Installation Charge: ${req.body.installationcharges}
Subscription Fee : ${req.body.subscriptionfee}
            
Let's gear up to provide the best ever experience to [User Name] with our CircoLife way. 
            
Best regards,
CircoLife Intelligent App`
        }
          transporter.sendMail(regestereduserMail, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        
        res.status(201).json({"Status":"Mail sent!"})
        
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

router.post('/sendService',async (req,res)=>{
    var newDate = new Date();
    try{
        var regestereduserMail = {
            from: 'appsdny@gmail.com',
            to: maillist,
            cc:cclistService,
            bcc:bcclist,
            subject: `Service Request Notification: ${req.body.username} Has Raised a complain`, 
            text:`Dear Circolife Team,

This is to inform you that ${req.body.username} has just now logged a complain in his subscribed AC through our app! 
            
Here are the details for the complain:
            
Name: ${req.body.username}
Phone: ${req.body.mobile}
Tonnage: ${req.body.model}
Issue Category: ${req.body.issuecat}
Issue Description : ${req.body.description}
Time of Raising Service Request :  ${req.body.time}
Address:  ${req.body.address}
            
Let's gear up and resolve the challenge for this AC as soon as possible and give ${req.body.username} the world class experience by CircoLife. 
            
Regards, 
CircoLife Intelligent App`
        }
          transporter.sendMail(regestereduserMail, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        
        res.status(201).json({"Status":"Mail sent!"})
        
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})
module.exports=router