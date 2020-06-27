require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

console.log(process.env.SECRET);
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});

const User = mongoose.model("User", userSchema);


//////////////////////////////////////////////////////////////////////Home/////////////////////////////////////////////////////////
app.route("/").get(function (req, res) {
  res.render("Home");
})
//////////////////////////////////////////////////////////////////////// Login//////////////////////////////////////////////////////
app.route("/login").get(function (req, res) {
  res.render("Login");
})
.post(function (req, res) {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({ email: userName},function (err, user){
        if (err) {
            console.log(err);
        }else if(user){
            if(user.password === password){
                res.render('secrets');
            }else {
            res.send('<h1>Sorry wrong password</h1>')
          }
        }else{
            console.log('<h1>Sorry wrong username</h1>');
        }
    })
})
//////////////////////////////////////////////////////////////////////// Register/////////////////////////////////////////////////
app
  .route("/register")
  .get(function (req, res) {
    res.render("Register");
  })

  .post(function (req, res) {
    const userName = req.body.username;
    const password = req.body.password;

    newUser = new User({
      email: userName,
      password: password,

    });
    newUser.save(function (err) {
        if(!err){
            res.render('secrets');
        }else{
            console.log(err);
        }
      })
  });
  

app.listen(3000, function () {
  console.log("listening on port 3000");
});
