//validation
const joi =require("joi")

const resistration_validation=data=>{
const schema=joi.object().keys({ 
    email:joi.string().email().required(),
    mobile: joi.string().length(10).pattern(/[1-9]{1}[0-9]{9}/).required(),
    Fullname:joi.string().min(3).required(),
    userid:joi.string().required(),
    userid:joi.string().required(),
    longitude:joi.string().required(),
    latitude:joi.string().required(),
    address:joi.string().required(),
    state:joi.string().required(),
    city:joi.string().required(),
    pincode:joi.string().required(),
    area:joi.string().required(),
    flat:joi.string().required(),
});
return schema.validate(data);
}

module.exports.resistration_validation=resistration_validation;