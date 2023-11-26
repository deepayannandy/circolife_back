const { bool } = require("joi")
const mongoos=require("mongoose")

const devicesSchema= new mongoos.Schema({
    userid:{
        type:String,
        required:true
    },
    deviceid:{
        type:String,
        required:true
    },
    deviceName:{
        type:String,
        required:true
    },
    isShared:{
        type:Boolean,
        required:false
    },
    isadmin:{
        type:Boolean,
        required:false
    },
    receiversid:{
        type:String,
        required:false
    },
    sendersName:{
        type:String,
        required:false
    },
    receiversName:{
        type:String,
        required:false
    },
    receiversNumber:{
        type:String,
        required:false
    },
    receiversImage:{
        type:String,
        required:false
    },
    sendersImage:{
        type:String,
        required:false
    },
})

module.exports=mongoos.model('Devices',devicesSchema )