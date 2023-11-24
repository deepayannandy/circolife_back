const { bool } = require("joi")
const mongoos=require("mongoose")

const transactionSchema= new mongoos.Schema({
    userid:{
        type:String,
        required:true
    },
    success:{
        type:Boolean,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    data:{
        type:Object,
        required:true
    },
    TimeStamp:{
        type:Date,
        required:true
    },
})

module.exports=mongoos.model('Transaction',transactionSchema )