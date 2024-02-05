const mongoos=require("mongoose")

const constsSchema= new mongoos.Schema({
    env:{
        type:String,
        required:true
    },
    invoice_prefix:{
        type:String,
        required:true
    },
    invoice_count:{
        type:Number,
        required:true
    },
})

module.exports=mongoos.model('Constants',constsSchema )