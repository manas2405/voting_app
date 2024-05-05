const express = require('express');
const router = exress.Router();
const User  =  require('../models/user')

router.post('/signup',async(req,res)=>{
    try
    {// req data from user body 
    const data  = req.body;
    //create new user
    const newUser = new User(data);
    // save new user
    const response = await newUser.save();
    // create payload
    const payload  = {
        id : response.id,
    }

    // genrate token
    const token = genrateToken(payload);
    res.status(201).json({
        success:true,
        response:response,
        token:token,
        message:"User created "
    }) 
}catch(err){
    console.log(err.message);
    res.status(500).json({
        success:false,
        message:"Error when creating user"
    })
}
})



router.post('/login',async(req,res)=>{
    try{
    //req from body
    const {adhaar,password} = req.body;
    //find the username if exists then verify token 
    const user = await User.findOne({adhaar:adhaar})
    if(!user || !(await user.comparePassword(password))){
        return res.status(401).json({
            success:false,
            message : "register first "
        })
    }
    const payload = {
        id : user.id,
    }
    const token  = genrateToken(payload);
    res.json(token);
}catch(error){
    console.log(error)
    res.status(500).json({
        success:false,

    })
}
});

router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try{
        //user data
        //get user id
        //findbyid using id
        //resonse user
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json(user)


    }catch(error){
        res.status(500).json({
            message:"internal error can get profile"
        })
    }
});

router.put('/profile/password',jwtAuthMiddleware,async(req,res)=>{
   try{ const userId = req.user.id;
    const {currentPassword,newPassword} = req.body;
    const user = await User.findById(userId);
    const checkPassword = await user.comparePassword(currentPassword)
    if(!checkPassword){
        res.status(401).json({
            message :"current password is wrong "
        })
    }
    user.password = newPassword;
    await user.save();
    console.log("password changed")
    res.status(200).json({message:"password updated"})
}catch(error){
    res.status(500).json({
        message:"internal error can change the password"
    })
}
})


module.exports = router;


