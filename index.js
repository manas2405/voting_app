const express  = require('express')
const app = express();
const db = require('./db/conf');
require('dotenv').config();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.get('/',(req,res)=>{
    res.send("server started yehh")
})

const userRoutes = require('./routes/userRoutes')
const candidateRoutes = require('./routes/candidateRoutes')
app.use('/user',userRoutes)
app.use('/candidate',candidateRoutes)
const PORT = process.env.PORT||3000
app.listen(PORT,(req,res)=>{
    console.log('server started yehhhh')
})