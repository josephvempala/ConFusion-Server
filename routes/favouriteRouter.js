const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Favourites = require('../models/favourites');
const cors = require('../cors');

const favouriteRouter = express.Router()

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favourites.findOne({user:req.user._id})
    .populate('user')
    .populate('dish')
    .then((favourites)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favourites);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.send('Put operation not supported on /favourite')
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favourites.findOne({user:req.user._id})
    .then((favourites)=>{
        if(!favourites){
            Favourites.create({user:req.user._id,dish:[]})
            .then((favourites)=>{
                for (i of req.body){
                    if((favourites.dish.indexOf(Object.values(i)[0])==-1))
                    favourites.dish.push(Object.values(i)[0]);
                }
                favourites.save()
                .then((favourites)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json')
                    res.json(favourites);
                })
            },err=>next(err))
        }
        else{
            for (i of req.body){
                if((favourites.dish.indexOf(Object.values(i)[0])==-1))
                favourites.dish.push(Object.values(i)[0]);
            }
            favourites.save()
            .then((favourites)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(favourites);
            })
        }
    })
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favourites.findOneAndDelete({user:req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

favouriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.send('get operation not supported on /favourite/dishid')
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.send('Put operation not supported on /favourite/dishid')
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favourites.findOne({user:req.user._id})
    .then((favourites)=>{
        if(!favourites){
            Favourites.create({user:req.user._id,dish:req.params.dishId})
                .then((favourites)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourites);
                })
            .catch(err=>next(err));
        }
        else{
            let index=favourites.dish.indexOf(req.params.dishId);
            console.log(index);
            if(index==-1){
                favourites.dish.push(req.params.dishId);
            }
            else{
                let err = new Error('duplicate element detected');
                err.status = 403;
                return next(err);
            }
        }   
    },(err)=>next(err))
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favourites.findOneAndRemove({user:req.user._id,dish:req.params.dishId})
    .then((favourites)=>{
        if(!favourites){
            err = new Error('no favourites');
            err.status = 404;
            return next(err);
        }
        else{
            res.statusCode = 200;
            res.json(favourites);
        }
    })
    .catch(err=>next(err))
})

module.exports=favouriteRouter;