const { bool, object } = require("joi")
const mongoos=require("mongoose")

const invoiceSchema= new mongoos.Schema({
    invoiceName:{
        type:String,
        required:true
    },
    userid:{
        type:String,
        required:true
    },
    invoiceId:{
        type:String,
        required:true
    },
    invoiceDate:{
        type:String,
        required:true
    },
    DueDate:{
        type:String,
        required:true
    },
    recipientname:{
        type:String,
        required:true
    },recipientshippingaddress:{
        type:String,
        required:true
    },
    recipientBillingaddress:{
        type:String,
        required:true
    },
    recipientgst:{
        type:String,
        required:false
    },
    statecode:{
        type:String,
        required:true
    },
    place_supply:{
        type:String,
        required:true
    },
    items:{
        type:Object,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    transactionId:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
})

module.exports=mongoos.model('Invoice',invoiceSchema )