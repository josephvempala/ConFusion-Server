const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const User = require('../models/user');
const passport = require('passport');
const cors = require('../cors')
const authenticate = require('../authenticate');
router.use(bodyparser.json());


/* GET users listing. */
router.options('*', cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
});
router.get('/', cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find({})
        .then((users) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        })
        .catch((err) => {
            next(err);
        })
});
router.options('/signup', cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
});
router.post('/signup', cors.corsWithOptions, (req, res, next) => {
    console.log('register called');
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
        } else {
            if (req.body.firstname)
                user.firstname = req.body.firstname;
            if (req.body.lastname)
                user.lastname = req.body.lastname;
            user.save((err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: err});
                    return;
                }
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successful!'});
                });
            });
        }
    });
});
router.put('/signup', cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.send('put operation not supported on signup endpoint');
});
router.delete('/signup', cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.send('delete operation not supported on signup endpoint');
});
router.options('/login', cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
});
router.get('/login', cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.send('get operation not supported on login endpoint');
});
router.put('/login', cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.send('put operation not supported on login endpoint');
});
router.post('/login', cors.corsWithOptions, (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);

        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'Login Unsuccessful!', err: info});
        }
        req.logIn(user, (err) => {
            if (err) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user'});
            }
            const token = authenticate.getToken({_id: req.user._id});
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Login Successful!', token: token});
        })
    })(req, res, next);


});
router.delete('/login', cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.send('delete operation not supported on login endpoint');
});

router.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json')
            return res.json({status: 'JWT invalid!', success: false, err: info});
        } else {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json')
            return res.json({status: 'JWT Valid!', success: true, user: user});
        }
    })(req, res)
})
module.exports = router;