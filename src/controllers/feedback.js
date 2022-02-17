const Feedback = require('../models/feedbacks');

const feedbackOptions = (req, res) => {
    res.sendStatus(200);
}

const getFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.find(req.query).populate('comments.author');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feedback);
    } catch (e) {
        next(e);
    }
}

const postFeedback = (req, res, next) => {
    try {
        const newFeedback = Feedback.create(req.body);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(newFeedback);
    } catch (e) {
        next(e);
    }
}

const deleteFeedback = (req, res, next) => {
    try {
        const result = Feedback.remove({});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    } catch (e) {
        next(e);
    }
}

module.exports = {
    deleteFeedback,
    feedbackOptions,
    getFeedback,
    postFeedback
}