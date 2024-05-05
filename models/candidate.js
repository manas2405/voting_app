const mongoose = require("mongoose")
const candidateSchemma  = new mongoose.Schema({
    username:{
        type: String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    party:{
        type:String,
        require:true
    },
    votes:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'User',
                require:true
            },
            votedAt:{
                type:Date,
                default:Date.now(),
            }
        }
    ],
    voteCount:{
        type:Number,
        default:true
    }

})
const Candidate =  mongoose.model('Candidate',candidateSchemma)
module.exports = Candidate