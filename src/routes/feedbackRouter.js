const express = require('express');
const authenticate = require('../../authenticate');
const cors = require('../../cors');
const {feedbackOptions, getFeedback, postFeedback, deleteFeedback} = require('../controllers/feedback');

const feedbackRouter = express.Router();

feedbackRouter
    .route('/')
    .options(cors.corsWithOptions, feedbackOptions)
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, getFeedback)
    .post(cors.cors, postFeedback)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, deleteFeedback);

module.exports = feedbackRouter;
