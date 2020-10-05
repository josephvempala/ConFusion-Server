const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Favorites = require('../models/favorites');
const cors = require('../cors');
const { findOne } = require('../models/favorites');

const favoriteRouter = express.Router()

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({user:req.user._id})
    .populate('user')
    .populate('dish')
    .then((favorites)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.send('Put operation not supported on /favorite')
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({user:req.user._id})
    .then((favorites)=>{
        if(!favorites){
            Favorites.create({user:req.user._id,dish:[]})
            .then((favorites)=>{
                for (i of req.body){
                    if((favorites.dish.indexOf(Object.values(i)[0])==-1))
                    favorites.dish.push(Object.values(i)[0]);
                }
                favorites.save()
                .then((favorites)=>{
                    Favorites.findById(favorites._id)
                    .populate('user')
                    .populate('dish')
                    .then((favorites)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json')
                        res.json(favorites);
                    })
                })
            },err=>next(err))
        }
        else{
            for (i of req.body){
                if((favorites.dish.indexOf(Object.values(i)[0])==-1))
                favorites.dish.push(Object.values(i)[0]);
            }
            favorites.save()
            .then((favorites)=>{
                Favorites.findById(favorites._id)
                    .populate('user')
                    .populate('dish')
                    .then((favorites)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json')
                        res.json(favorites);
                    })
            })
        }
    })
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOneAndDelete({user:req.user._id})
    .then((resp) => {
        Favorites.findById(favorites._id)
            .populate('user')
            .populate('dish')
            .then((favorites)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(favorites);
            })
    }, (err) => next(err))
    .catch((err) => next(err));
})

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites,findOne({user:req.user._id})
    .then((favorites)=>{
        if(!favorites){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json')
            return res.json({"exists": false, "favorites":favorites})
        }
        else {
            if(favorites.dish.indexOf(req.params.dishId)){
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json')
                return res.json({"exists": false, "favorites":favorites})
            }
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json')
                return res.json({"exists": true, "favorites":favorites})
            }
        }
    },err=>next(err))
    .catch((err)=>next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.send('Put operation not supported on /favorite/dishid')
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({user:req.user._id})
    .then((favorites)=>{
        if(!favorites){
            Favorites.create({user:req.user._id,dish:req.params.dishId})
                .then((favorites)=>{
                    Favorites.findById(favorites._id)
                    .populate('user')
                    .populate('dish')
                    .then((favorites)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json')
                        res.json(favorites);
                    })
                })
            .catch(err=>next(err));
        }
        else{
            let index=favorites.dish.indexOf(req.params.dishId);
            console.log(index);
            if(index==-1){
                favorites.dish.push(req.params.dishId);
                favorites.save()
                .then((favorites)=>{
                    Favorites.findById(favorites._id)
                    .populate('user')
                    .populate('dish')
                    .then((favorites)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json')
                        res.json(favorites);
                    })
                })
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
    Favorites.findOneAndRemove({user:req.user._id,dish:req.params.dishId})
    .then((favorites)=>{
        if(!favorites){
            err = new Error('no favorites');
            err.status = 404;
            return next(err);
        }
        else{
            Favorites.findById(favorites._id)
                .populate('user')
                .populate('dish')
                .then((favorites)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json')
                    res.json(favorites);
                })
        }
    })
    .catch(err=>next(err))
})

module.exports=favoriteRouter;