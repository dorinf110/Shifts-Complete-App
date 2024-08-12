var user = require('./userSchema');
var comment = require('./commentSchema');
var shift = require('./shiftSchema');
var jwt = require('jsonwebtoken');
let secretKey = "kjqiruq890mvqopcmpqg0rasevar3792v8nya9r84yQ5@%!";

// function to create a user
exports.createUser = async function(req,res){
    try{
        let newUser = await user.create(req.body);
        newUser.created=Date.now();
        newUser.updated=Date.now();
        await newUser.save();
        res.status(201).json({status:"Success!", data:newUser});
    }
    catch(err){
        console.log(err);
        res.status(400).json({status:"Failed!", message:err});
    }
}

// function to create a token
let signToken=id=>
{
    return jwt.sign({id:id},secretKey,{expiresIn:'1h'});
}

// function to login a user
exports.loginUser = async function (req,res){
    let {email,password} = req.body;
    if(!email || !password)
    {
        res.status(400).send('No email or password received!');
        return;
    }
    user.findOne({email:email}).then(data=>{
        if(!data)
        {
            res.status(400).send("User not found!");
            return;
        }
        else
        {
            
            if(!data || !data.authenticate(password))
            {
                res.status(400).send("Incorrect password!");
                return;
            }
            else
            {
            //create and send token
               let token = signToken(data._id);
               res.status(200).json({status:"Success!", token:"Bearer "+ token})
            }
        }
        
    })
}

// function to get all users
exports.allUsers = async function(req,res){
    try {
        // get users and populate with comments
        let allUsers = await user.find().populate({path:'comments',select:"description _id created"});
        res.status(200).json({status:"Success!", count:allUsers.length, data:allUsers});
    }
    catch(err){
        console.log(err);
        res.status(400).json({status:"Failed!", message:err});  
    }

};

// function to update a user
exports.updateUser = async function(req,res){
    if(req.body.permission){
       delete req.body.permission;
    }
    try {
        let id = req.params.id;
        // let userFound = await user.findByIdAndUpdate(id,req.body,{new:true, runValidators:true});
        let userFound = await user.findById(id);
        if(!userFound){
            res.status(400).json({status:"Failed!",message:"User not found!"})
            return;
        }
        // check if the logged user is the same as the updated user
        if(req.presentUser._id != id){
           res.status(400).json({status:"Failed!",message:"You are not allowed to update other user's data!"});
           return;
        }
        // modify updated date
        req.body.updated=Date.now();
        await userFound.updateOne(req.body,{runValidators:true});
        let result_update = await user.findById(id);
        res.status(200).json({status:"Success!", data:result_update});
    }
    catch(err){
        console.log(err);
        res.status(400).json({status:"Failed!", message:err});  
    }
 };

// function to delete a user
exports.deleteUser = async function(req,res){
    try {
        let id = req.params.id;
        let userFound = await user.findByIdAndDelete(id);
        if(!userFound){
            res.status(400).json({status:"Failed!",message:"User not found!"})
            return;
        }
        // remove also the user's shifts
        let shifts = new Array(...await shift.find({userId:id}));
        shifts.forEach(async item=> await shift.findByIdAndDelete(item.id));
        // remove the user's comments too
        let comments = new Array(...await comment.find({userId:id}));
        comments.forEach(async item=> await comment.findByIdAndDelete(item.id));
        return res.status(200).json({status:"Success! User deleted.", data:userFound});
    }
    catch(err){
        console.log(err);
      res.status(400).json({status:"Failed!", message:err});  
    }
};

// function to get a user
exports.getUser = async function(req,res){
    try {
        let id = req.params.id;
        // to check if the logged user is the same as req user or is admin
        if(req.presentUser._id != id && req.presentUser.permission != "admin"){
            res.status(400).json({status:"Failed!",message:"You are not allowed to see other user's data!"})
            return;
        }
        // find user and populate with comments
        userFound = await user.findById(id).populate({path:'comments',select:"description _id created"});
        if(!userFound){
            res.status(400).json({status:"Failed!",message:"User not found!"});
            return;
        }
        res.status(200).json({status:"Success!", data:userFound});
    }
    catch(err){
        res.status(400).json({status:"Failed!", message:"Incorrect Id!"});  
    }

}

// To check if the user is logged in
exports.protectUser = async function(req,res,next){
    try{
        let valueToken = req.headers.authorization;
        let token;
        if (valueToken && valueToken.startsWith("Bearer")){
            token = valueToken.split(" ")[1];
        }
        if(!token){
            res.status(401).json({status:"Failed!", message:"User not logged in!"});
            return;
        }
        // check the token
        let verifyToken = await jwt.verify(token, secretKey); 
        // find the user by id from token
        let currentUser = await user.findById(verifyToken.id);
        if(!currentUser){
            res.status(401).json({status:"Failed",message:"User not found!"});
            return;
        }
        // save the logged user in req object
        req.presentUser = currentUser;
        next();
    }catch(err){
        console.log(err);
        res.status(400).json({status:"Protection error", message:JSON.stringify(err)});  
    }
}

// To check if the user is admin
exports.isAdmin = async function(req,res,next){
    try{
        if(req.presentUser && req.presentUser.permission && req.presentUser.permission == "admin"){
            next();
        } 
        else {
         res.status(403).json({status:"Failed!", message:"Permission denied!"})
         return;
        }
        
    }catch(err){
        console.log(err);
        res.status(400).json({status:"Eroare", message:err.message});  
    }
 }

