const mongoos=require("mongoose")

const addressSchema= new mongoos.Schema({
    userid:{
        type:String,
        required:true
    },
    longitude:{
        type:String,
        required:true
    },
    latitude:{
        type:String,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    flat:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
   
})

module.exports=mongoos.model('Address',addressSchema )