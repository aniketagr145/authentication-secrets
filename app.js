require('dotenv').config();
const express = require('express');
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
const encrypt  = require('mongoose-encryption');
const ejs = require('ejs');
 
const app = express();

// console.log(process.env.SECRET);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

userSchema =new mongoose.Schema({
    email : String,
    password : String
});

// var encKey = process.env.SOME_32BYTE_BASE64_STRING;
// var sigKey = process.env.SOME_64BYTE_BASE64_STRING;
const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret:secret ,encryptedFields:["password"]});


const User = new mongoose.model("User", userSchema);

app.get('/',function(req,res){
    res.render("home");

});
app.get('/login',function(req,res){
    res.render("Login");

});
app.get('/register',function(req,res){
    res.render("register");
});
app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    })
});
app.post("/login", function(req,res){
    const userName  = req.body.username;
    const password = req.body.password;
    User.findOne({email:userName},function(err,foundUser){
        if(err)
        {
            console.log(err);
        }
        else{
            if(foundUser)
            {
                if(foundUser.password === password)
                {
                    res.render("secrets");
                }
            }
        }
    });
});



app.listen(3000, function(){
    console.log('server is running on port 3000');
});