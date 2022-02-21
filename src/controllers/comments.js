const Comments = require('../models/comments');

const commentsOptions = (req, res) => {
    res.sendStatus(200);
};

const getComments = async (req, res, next) => {
    try {
        const comments = await Comments.find(req.query).populate('author').lean();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comments);
    } catch (e) {
        next(e);
    }
};

const postComment = async (req, res, next) => {
    if (req.body == null) {
        const err = new Error('Comment not found in request body');
        err.status = 404;
        next(err);
        return;
    }
    try {
        req.body.author = req.user._id;
        const newComment = await Comments.create(req.body);
        const foundComment = await newComment.populate('author').lean();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(foundComment);
    } catch (e) {
        next(e);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const resp = await Comments.deleteMany({});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    } catch (e) {
        next(e);
    }
};

const getCommentById = async (req, res, next) => {
    try {
        const comments = await Comments.findById(req.params.id).populate('author').lean();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comments);
    } catch (e) {
        next(e);
    }
};

const patchCommentById = async (req, res, next) => {
    try {
        const comment = await Comments.findById(req.params.id).lean();
        if (comment === null) {
            const err = new Error('Comment not found');
            err.status = 404;
            next(err);
            return;
        }
        if (!comment.author.equals(req.user._id)) {
            const err = new Error('You are not permitted to edit this comment');
            err.status = 403;
            next(err);
            return;
        }
        const updatedComment = await Comments.findByIdAndUpdate(comment._id, {$set: req.body}, {new: true}).populate('author').lean();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(updatedComment);
    } catch (e) {
        next(e);
    }
};

const deleteCommentById = async (req, res, next) => {
    try {
        const commentToDelete = await Comments.findById(req.params.id).lean();
        if (!commentToDelete) {
            const err = new Error('Comment ' + req.params.id + ' not found');
            err.status = 404;
            next(err);
            return;
        }
        if (!commentToDelete.author.equals(req.user._id)) {
            const err = new Error('You are not authorized to delete this comment!');
            err.status = 403;
            next(err);
            return;
        }
        const result = await Comments.deleteOne({_id: req.params.id});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    } catch (e) {
        next(e);
    }
};

module.exports = {
    commentsOptions,
    getComments,
    getCommentById,
    postComment,
    patchCommentById,
    deleteComment,
    deleteCommentById,
};
