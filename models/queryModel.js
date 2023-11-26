const { bool } = require("joi")
const mongoos=require("mongoose")

const querySchema= new mongoos.Schema({
    userid:{
        type:String,
        required:true
    },
    contactperson:{
        type:String,
        required:true
    },
    contactnumber:{
        type:String,
        required:true
    },
    contactemail:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    summery:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    },
    TimeStamp:{
        type:Date,
        required:true
    },
})

module.exports=mongoos.model('Query',querySchema )