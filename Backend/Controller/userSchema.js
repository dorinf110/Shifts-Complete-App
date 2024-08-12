var mongoose = require('mongoose');
var schema = mongoose.Schema;
var bcrypt =require('bcryptjs');
var userSchema = new schema({
    email:{type:String, required:[true, "Email required!"],unique:true, lowercase:true, validate: {validator: function (value) 
        {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: 'Invalid email address format',
      }},
    password: {type:String,required:[true,"Password required!"], minlength:[6,"Too short password"], trim:true},
    firstname: {type:String, required:[true, "Firstname required!"], minlength:[3, "Too short firstname!"], trim:true},
    lastname: {type:String, required:[true, "Lastname required!"], minlength:[3, "Too short lastname!"], trim:true},
    permission : {type:String, enum:["regular_user","admin"],default:"regular_user"},
    comments:[{type:mongoose.Schema.ObjectId,ref:'comments'}],
    created:{type:Date, default:(new Date()).toLocaleString()},
    updated:{type:Date, default:(new Date()).toLocaleString()}
});


// middleware function to hash the modified password before saving it
userSchema.pre("save", function(next){
    if(!this.isModified("password")){
       return next();
    }
    else{
        var salt = bcrypt.genSaltSync(9);
        this.password = bcrypt.hashSync(this.password,salt);
        next();
    }
})

// function to check the entered password
userSchema.methods.authenticate=function(plaintextpassword){
        return bcrypt.compareSync(plaintextpassword,this.password)
    }

module.exports = mongoose.model("users",userSchema);