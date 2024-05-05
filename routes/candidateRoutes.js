const express = require('express');
const router = express.Router();
const User  =  require('../models/user');
const Candidate = require('../models/candidate');

const { jwtAuthMiddleware } = require('../middleware/auth');

const checkUserAdmin = async(userId)=>{
    try{
        const user = User.findById(userId);
        if (user.role === "admin")
            return true;
    }catch(err){
        return false;
    }
}

router.post('/',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(! await checkUserAdmin(req.user.id)){
           return res.status(400).json({message : "Only admin can access"})
        }
        const data = req.body;
        const newCandidate = new Candidate(data);
        const response= await newCandidate.save();
        return   res.status(201).json({
            success:true,
            response :response,
            message:"Candidate registered successfully"
         })
    }catch(error){
        return  res.status(500).json({
            success:false,
            message:"Error while regitering the candidate"
        })
    }
    
})


router.put('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(!checkUserAdmin(req.user.id)){
            return   res.status(400).json({message : "Only admin can access"})
        }
        const candidateID = req.params.candidateID;
        const updatedCandData = req.body;
        const response = await Candidate.findByIdAndUpdate(candidateID,updatedCandData,{
            new :true,
            runValidators:true
        })
        if(!response){
            return  res.status(402).json({message:"Candidate not found"})
        }

        return res.status(201).json({
            response:response,
            message:"Candidate updated successfully"
        })


    }catch(error){
        return  res.status(500).json({
            success:false,
            message:"Error while updating candidate data"
        })
    }
})

router.delete('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(!checkUserAdmin(req.user.id)){
            return   res.status(400).json({message : "Only admin can access"})
        }
        const candidateID = req.params.candidateID;
        const response = await Candidate.findByIdAndDelete(candidateID);
        if(!response){
            return  res.status(404).json({
                message:"Candidate not found",
            })
        }
        return  res.status(201).json({
            message:"Candidate deleted",
        })

    }catch(err){
        return  res.status(500).json({
            success:false,
            message:"Error while deleting candidate"
        })
    }

})

router.post('/vote/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    const candidateID = req.params.id;
    const userID =req.user.id;
    try{
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return  res.status(404).json({
                message:"Candidate not found"
            })

        }
        const user = await User.findById(userID);
        if(!user){
            return  res.status(404).json({
                message:"User not found"
            })
        }
        if(user.isVoted){
            return  res.status(400).json({
                message:"User can only vote once",
            })
        }
        if(user.role == "admin"){
            return  res.status(403).json({
                message:"Admin can not vote",
            })
        }
        candidate.votes.push({user : userID})
        candidate.voteCount++;
        await candidate.save();
        // update user
        user.isVoted = true;
        await user.save();
        return res.status(201).json({
            message:"User successfully voted"
        })
    }catch(err){
        return  res.status(500).json({
            message:"Error while pushing vote"
        })
    }
})
router.get('/vote/count',async(req,res)=>{
    try{
    const candidate = await Candidate.find().sort({voteCount:'desc'})
    const record = candidate.map((data)=>{
     return{ 
             name:data.party,
             count:data.voteCount,
         }
    });
    return res.status(200).json({
        record :record,
        message:"Count done"
    })
}catch(err){
    res.status(500).json({
        message:"Internal server error , while counting votes"
    })
}
})

router.get('/',async(req,res)=>{
    try{
        const candidate = await Candidate.find({},'name party-_id')
         return res.status(200).json(candidate);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


module.exports = router;