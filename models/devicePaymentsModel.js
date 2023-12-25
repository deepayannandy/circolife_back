const { bool, number } = require("joi")
const mongoos=require("mongoose")

const devicePaymentSchema= new mongoos.Schema({
    orderid:{
        type:String,
        required:true
    },
    deviceid:{
        type:String,
        required:true
    },
    subsEndDate:{
        type:Date,
        required:true
    },
    ispaid:{
        type:Boolean,
        required:true
    },
    paidAmount:{
        type:Number,
        required:true
    },
    transactionID:{
        type:String,
        required:false
    },
    paidDate:{
        type:Date,
        required:false
    },
    paymentcount:{
        type:Number,
        required:true
    },
})

module.exports=mongoos.model('DevicePayments',devicePaymentSchema )