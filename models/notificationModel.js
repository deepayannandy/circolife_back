const mongoos=require("mongoose")

const notificationSchema= new mongoos.Schema({
    userid:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    isread:{
        type:Boolean,
        required:true
    },
    catagory:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:false
    },
    date:{
        type:Date,
        required:true
    },
})

module.exports=mongoos.model('Notifications',notificationSchema )