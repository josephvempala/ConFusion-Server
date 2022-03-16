const Feedback = require('../models/feedbacks');

const feedbackOptions = (req, res) => {
    res.sendStatus(200);
};

const getFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.find(req.query).populate('comments.author');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feedback);
    } catch (e) {
        next(e);
    }
};

const postFeedback = async (req, res, next) => {
    try {
        const newFeedback = await Feedback.create(req.body);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(newFeedback);
    } catch (e) {
        next(e);
    }
};

const deleteFeedback = async (req, res, next) => {
    try {
        const result = await Feedback.deleteMany({});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    } catch (e) {
        next(e);
    }
};

module.exports = {
    deleteFeedback,
    feedbackOptions,
    getFeedback,
    postFeedback,
};
