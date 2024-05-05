const express  = require('express')
const app = express();
const db = require('./db/conf');
require('dotenv').config();
app.get('/',(req,res)=>{
    res.send("server started yehh")
})

const userRoutes = require("./routes/userRoutes")
app.use('/user',userRoutes)
const PORT = process.env.PORT||3000
app.listen(PORT,(req,res)=>{
    console.log('server started yehhhh')
})