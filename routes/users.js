var express = require('express');
var router = express.Router();
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
var User=require('../models/user');
var passport = require('passport');
var router=express.Router();
router.use(bodyparser.json());


/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/signup',(req,res,next) => {
  console.log('register called');
  User.register(new User({username:req.body.username}),
  req.body.password, (err,user) => {
    if(err){
      res.statusCode=500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
    }
    else{
      passport.authenticate('local')(req,res,() => {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json({success:true,status:'Registration Successful!'});
      });
    }
  });
});
router.post('/login', passport.authenticate('local'), (req,res)=>{
  res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json({success:true,status:'Login Successful!'});
});
module.exports = router;