var shift = require('./shiftSchema');
var user = require('./userSchema');

// function to add a shift
exports.addShift= async function(req,res){
    try{
        let newShift = await shift.create(req.body);
        // userId is filled in with logged user id from the req saved there by protect user function
        newShift.userId = req.presentUser._id;
        newShift.created=Date.now();
        newShift.updated=Date.now();
        await newShift.save();
        res.status(201).json({status:"Success! Shift added.", data:newShift});
    }
    catch(err){
        console.log(err);
        res.status(400).json({status:"Failed!", message:err});
    }
}

// function to get all shifts
exports.getAllShifts = async function(req,res){
    try {
        let allShifts = await shift.find();
        res.status(200).json({status:"Success!", count:allShifts.length, data:allShifts});
    }
    catch(err){
        console.log(err);
        res.status(400).json({status:"Failed!", message:err});  
    }

};

// function to update a shift
exports.updateShiftById = async function(req,res){
    try {
        let id = req.params.id;
        let shiftFound = await shift.findById(id);
        if(!shiftFound){
            res.status(400).json({status:"Failed!",message:"Shift not found!"});
            return;
        }
        // to check if the logged user is the same as req user
        if(shiftFound.userId != req.presentUser._id){
            return res.status(400).json({status:"Failed!",message:"You are not allowed to update other user's shifts"})
        }
        req.body.updated=Date.now();
        await shiftFound.updateOne(req.body,{runValidators:true});
        let result_update = await shift.findById(id);
        res.status(200).json({status:"Success! Shift updated.", data:result_update});
    }
    catch(err){
        console.log(err);
        res.status(400).json({status:"Failed!", message:err});  
    }
 };

//  function to delete a shift
exports.deleteShift = async function(req,res){
    try {
        let id = req.params.id;
        let shiftFound = await shift.findByIdAndDelete(id);
        if(!shiftFound){
          res.status(400).json({status:"Failed!",message:"Shift not found!"});
          return;
        }
        res.status(200).json({status:"Success! Shift deleted.", data:shiftFound});
    }
    catch(err){
        console.log(err);
        res.status(400).json({status:"Failed!", message:err});  
    }
};

// function to get a shift by id
exports.getShiftById = async function(req,res){
    try {
        let id = req.params.id;
        shiftFound = await shift.findById(id);
        if(!shiftFound){
           res.status(400).json({status:"Failed!",message:"Shift not found!"});
           return;
        }
        // to check if the logged user is the same as req user or is admin
        if(shiftFound.userId != req.presentUser._id && req.presentUser.permission != "admin"){
             res.status(400).json({status:"Failed!",message:"You are not allowed to see other user's shifts"});
             return;
        }
        res.status(200).json({status:"Success!", data:shiftFound});
    }
    catch(err){
        res.status(400).json({status:"Failed!", message:"Incorrect Id!"});  
    }
}

// function to get shift by user id
exports.getShiftByUserId = async function(req,res){
        try {
            let userId = req.params.id;
            let userFound = await user.findById(userId);
            // to check if user exists
            if(!userFound){
                res.status(400).json({status:"Failed!",message:"User not found!"});
                return;
            }
            let shiftFound = await shift.find({userId:userId});
            if(!shiftFound){
                res.status(400).json({status:"Failed!",message:"Shifts not found!"});
                return;
            }
            // to check if the logged user is the same as req user or is admin
            if(userId != req.presentUser.id && req.presentUser.permission != "admin"){
              res.status(400).json({status:"Failed!",message:"You are not allowed to see other user's shifts"});
              return;
            }
            if(shiftFound.length > 0){
                res.status(200).json({status:"Success!", count:shiftFound.length, data:shiftFound});
                return;
            }
             res.status(200).json({status:"Success!", message:"This user has no shifts."});
             return;
        }
        catch(err){
            res.status(400).json({status:"Failed!", message:"Incorrect Id!"});  
        }
}



