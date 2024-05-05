const mongoose = require('mongoose')
require('dotenv').config()
const URI = process.env.URI   
mongoose.connect(URI,{
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(()=>{
    console.log("db connected")
})
.catch(()=>{
    console.log("error while connecting to db")
})
