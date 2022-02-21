const express = require('express');
const authenticate = require('../../authenticate');
const cors = require('../../cors');
const {
    commentsOptions,
    getComments,
    postComment,
    deleteComment,
    getCommentById,
    patchCommentById,
    deleteCommentById,
} = require('../controllers/comments');

const commentRouter = express.Router();

commentRouter
    .route('/')
    .options(cors.corsWithOptions, commentsOptions)
    .get(cors.cors, getComments)
    .post(cors.corsWithOptions, authenticate.verifyUser, postComment)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, deleteComment);

commentRouter
    .route('/:id')
    .options(cors.corsWithOptions, commentsOptions)
    .get(cors.cors, getCommentById)
    .patch(cors.corsWithOptions, authenticate.verifyUser, patchCommentById)
    .delete(cors.corsWithOptions, authenticate.verifyUser, deleteCommentById);

module.exports = commentRouter;
