var express = require('express');
var app = express();
var port = 3000;
// to allow requests from the front end running on the same computer on port 4200
var cors = require('cors');
app.use(cors());
app.use(express.json());
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://dorinf110:xkfq2145c3@cluster0.t0fhvkb.mongodb.net/?retryWrites=true&w=majority";
var options = {useNewUrlParser:true, dbName:"ShiftsDB"};
var mongoose  = require ('mongoose');
let userRoute=require('./Router/userRoute');
let shiftRoute = require('./Router/shiftRoute');
let commentRoute = require('./Router/commentRoute');
app.use("/api",shiftRoute);
app.use("/api",userRoute);
app.use("/api",commentRoute);
mongoose.connect(uri,options);

app.listen(port,()=>{
    console.log("Server started!");
});