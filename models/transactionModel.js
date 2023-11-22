const mongoos=require("mongoose")

const transactionSchema= new mongoos.Schema({
    response:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },})

module.exports=mongoos.model('Transaction',transactionSchema )