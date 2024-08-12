var mongoose = require('mongoose');
var schema = mongoose.Schema;
var shiftSchema = new schema({
    userId:{type:String, trim:true,lowercase:true},
    start:{type:Number, min:[Date.now()-31556926000,"Cannot record shifts started more than one year ago!"], max:[Date.now(),"Cannot record shifts for the future"],required:[true,"start required!"]},
    end:{type:Number,required:[true,"end required!"], max:[Date.now(),"Cannot record shifts ending in the future"]},
    perHour:{type:Number,min:[0.1,"perHour cannot be negative or null"],required:[true,"perHour required!"]},
    place:{type:String,enum:{values:["Downtown","Park","Stadium"],default:"Downtown",message:"Place has to be one of 'Park', 'Stadium' or 'Downtown'"},required:[true,"Place required!"]},
    created:{type:Date, default:(new Date()).toLocaleString()},
    updated:{type:Date, default:(new Date()).toLocaleString()}
});

module.exports = mongoose.model("shifts",shiftSchema);