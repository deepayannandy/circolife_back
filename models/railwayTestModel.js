const mongoos=require("mongoose")

const railwaySchema= new mongoos.Schema({
    deviceMac:{
        type:String,
        required:true
    },
    STB1_05_XMVBLifeSig:{
        type:String,
        required:true
    },
    STB1_01_LActKSwD:{
        type:Boolean,
        required:true
    },
    FLG1_07_XNodeMSC:{
        type:String,
        required:true
    },
    LAT:{
        type:Number,
        required:true
    },
    LON:{
        type:Number,
        required:true
    },
    HBB2_31_LPanUpw_ish:{
        type:Boolean,
        required:true
    },
    HBB2_31_LPanDnish:{
        type:Boolean,
        required:true
    },
    SLG1_XTempMotor1_Convert:{
        type:Number,
        required:true
    },
    SLG1_XTempMotor2_Convert:{
        type:Number,
        required:true
    },
    G1_XTempMotorB_Convert:{
        type:Number,
        required:true
    },
    SLG1_XTempoilConv1_Convert:{
        type:Number,
        required:true
    },
    BUR2_X73_Battery_Vol:{
        type:Number,
        required:true
    },
    BUR2_XUFWR:{
        type:Number,
        required:true
    },
    BUR2_XUUZ:{
        type:Number,
        required:true
    },
    BUR3_XUFWR:{
        type:Number,
        required:true
    },
})

module.exports=mongoos.model('railwaySchema',railwaySchema )