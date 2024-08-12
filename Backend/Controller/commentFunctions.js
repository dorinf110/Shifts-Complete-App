var comment = require("./commentSchema");
var user = require("./userSchema");

// function to create comments
exports.createComment= async function(req,res){
    try{
        let newComment = await comment.create(req.body);
        // retrieve current user from req saved by protect user function
        newComment.userId=req.presentUser._id;
        // push the new comment in user's comments array
        req.presentUser.comments.push(newComment);
        newComment.created=Date.now();
        newComment.updated=Date.now();
        await newComment.save().then(comm=>{
            // console.log(comm);
        });
        await req.presentUser.save();
        res.status(201).json({status:"Success! Comment created.", data:newComment});
    }
    catch(err){
        console.log(err);
        res.status(400).json({status:"Failed!", message:err});
    }
}

// function to get all comments
exports.getAllComments = async function(req,res){
    try {
        let allComments = await comment.find();
        res.status(200).json({status:"Success!", count:allComments.length, data:allComments});
    }
    catch(err){
        console.log(err);
        res.status(400).json({status:"Failed!", message:err});  
    }

};

// function to update a comment
exports.updateCommentById = async function(req,res){
    try {
        let id = req.params.id;
        let commentFound = await comment.findById(id);
        if(!commentFound){
            res.status(400).json({status:"Failed!",message:"Comment not found!"});
            return;
        }
        // to check if the logged user is the same as req user
        if(commentFound.userId != req.presentUser._id){
            res.status(400).json({status:"Failed!",message:"You are not allowed to update other user's comments!"});
            return;
        }
        req.body.updated=Date.now();
        await commentFound.updateOne(req.body,{runValidators:true});
        let result_update = await comment.findById(id);
        res.status(200).json({status:"Success!", data:result_update});
    }
    catch(err){
        console.log(err);
        res.status(400).json({status:"Failed!", message:err});  
    }
 };

// function to delete a comment
exports.deleteComment = async function(req,res){
    try {
        let id = req.params.id;
        let commentFound = await comment.findByIdAndDelete(id);
        if(!commentFound){
            return res.status(400).json({status:"Failed!",message:"Comment not found!"})
        }

        // remove the deleted comment from user's comments array
        let userId = commentFound.userId;
        // get the user who had the deleted comment
        let userToUpdate = await user.findById(userId);
        // filter the comments array of the user 
        let comments_new = userToUpdate.comments.filter((x)=>{return x!=id});
        // update the user
        await user.findByIdAndUpdate(userId,{comments:comments_new,updated:Date.now()});
        res.status(200).json({status:"Success! Comment deleted.", data:commentFound});
     
    }
    catch(err){
        console.log(err);
        res.status(400).json({status:"Failed!", message:err});  
    }
};

// function to get the comment by id
exports.getCommentById = async function(req,res){
    try {
        let id = req.params.id;
        let commentFound = await comment.findById(id);
        if(!commentFound){
             res.status(400).json({status:"Failed!",message:"Comment not found!"});
             return;
        }
        // to check if the logged user is the same as req user or is admin
        if(commentFound.userId != req.presentUser._id && req.presentUser.permission != "admin"){
             res.status(400).json({status:"Failed!",message:"You are not allowed to see other user's comments!"});
             return;
        }
        return res.status(200).json({status:"Success!", data:commentFound});
    }
    catch(err){
        res.status(400).json({status:"Failed!", message:"Incorrect Id!"});  
    }
}

// function to get all user's comments
exports.getAllUserComments = async function(req,res){
    try {
        let usrId = req.params.userId;
        // to check if the logged user is the same as req user or is admin
        if(req.presentUser._id != usrId && req.presentUser.permission != "admin"){
             res.status(400).json({status:"Failed!",message:"You are not allowed to see other user's comments!"});
             return;
        }
        let userFound = await user.findById(usrId);
           // to check if user still exists
            if(!userFound){
                res.status(400).json({status:"Failed!",message:"User not found!"});
                return;
            }
        let commentFound = await comment.find({userId:usrId});
        if(!commentFound){
             res.status(400).json({status:"Failed!",message:"Comment not found!"});
             return;
        }
        if(commentFound.length > 0){
         res.status(200).json({status:"Success!", count:commentFound.length, data:commentFound});
         return;
        }
         res.status(200).json({status:"Success!", message:"This user has no comments"});
         return;
    }
    catch(err){
        res.status(400).json({status:"Failed!", message:"Incorrect Id!"});  
    }
}