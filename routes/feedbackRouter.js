const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Feedbacks = require('../models/feedbacks');
const cors = require('../cors');

const feedbackRouter = express.Router();

feedbackRouter.use(bodyParser.json());

feedbackRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Feedbacks.find(req.query)
            .populate('comments.author')
            .then((feedbacks) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(feedbacks);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.cors, (req, res, next) => {
        Feedbacks.create(req.body)
            .then((feedback) => {
                console.log('Feedback Created ', feedback);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(feedback);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.send('PUT operation not supported on /feedbacks');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Feedbacks.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = feedbackRouter;