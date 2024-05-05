const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
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
userSchemma.pre('save',async function(next){
    const user = this;
    if(!user.isModified('password'))return next();
   try {
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password,salt);
     user.password = hashedPassword;
     next();
   } catch (error) {
    return next(error)
    
   }


})
userSchemma.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare(candidatePassword,this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}
const User =  mongoose.model('User',userSchemma)
module.exports = User