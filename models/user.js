const mongoose = require("mongoose")
const userSchemma  = new mongoose.Schema({
    username:{
        type: String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    adhaar:{
        type:Number,
        require:true
    },
    isVoted:{
        type:Boolean,
        default:false,
    },
    role:{
        type:String,
        enum:['admin','voter'],
        default:'voter'
    },

})
const User =  mongoose.model('User',userSchemma)
module.exports = User