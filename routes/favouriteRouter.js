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
            Favourites.create({user:req.user._id})
            .then((favourites) => {
                for(let i in req.body){
                    for(let j in favourites.dish){
                        if(i._id==j){
                            continue;
                        }
                        else{
                            favourites.dish.push(i._id);
                        }
                    }
                }
                favourites.save()
                    .then((favourites)=>{
                    console.log('Favourites Created ', favourites);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourites);
                    })
                    .catch((err)=>{
                        next(err);
                    })
            })
            .catch((err) => next(err));
        }
        else{
            for(let i in req.body){
                for(let j in favourites.dish){
                    if(i._id==j){
                        continue;
                    }
                    else{
                        favourites.dish.push(i._id);
                    }
                }
            }
            favourites.save()
            .then((favourites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourites);               
            }, (err) => next(err));
    
        }
    })
    .catch((err)=>{
        next(err);
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
    Favourites.findOne({user:req.user._id})
    .then((favourites)=>{
        if(!favourites){
            err = new Error('no favourites');
            err.status = 404;
            return next(err);
        }
        else{
            let index = favourites.dish.indexOf(req.params.dishId);
            if(index==-1){
                err = new Error('no such favourite');
                err.status = 404;
                return next(err);
            }
            else{
                delete favourites.dish[index];
                favourites.save()
                .then((favourites)=>{
                    res.statusCode = 200;
                    res.json(favourites);
                })
            }
        }
    })
})

module.exports=favouriteRouter;