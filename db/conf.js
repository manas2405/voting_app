const mongoose = require('mongoose')
require('dotenv').config()
const URI = process.env.URI   
mongoose.connect(URI,{
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
// .then(()=>{
//     console.log("db connected")
// })
// .catch(()=>{
//     console.log("error while connecting to db")
// })

// Get the default connection
// Mongoose maintains a default connection object representing the MongoDB connection.
const db = mongoose.connection;

// Define event listeners for database connection

db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});
module.exports  = db