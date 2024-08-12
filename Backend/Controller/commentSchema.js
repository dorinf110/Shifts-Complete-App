var mongoose = require('mongoose');
var schema = mongoose.Schema;
var commentSchema = new schema({
userId: {type:String,trim:true,lowercase:true},
description: {type:String, required:[true,"Description required!"],trim:true,lowercase:true,min:[3,"Too short comment"]},
created:{type:Date, default:(new Date()).toLocaleString()},
updated:{type:Date, default:(new Date()).toLocaleString()}
});


module.exports = mongoose.model("comments",commentSchema);