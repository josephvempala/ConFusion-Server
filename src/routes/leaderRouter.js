const express = require('express');
const authenticate = require('../../authenticate');
const cors = require('../../cors');
const {
    leaderOptions,
    getLeaders,
    postLeader,
    deleteLeaders,
    getLeaderByParam,
    patchLeaderByParam,
    deleteLeaderByParam,
} = require('../controllers/leaders');

const leaderRouter = express.Router();

leaderRouter
    .route('/')
    .options(cors.corsWithOptions, leaderOptions)
    .get(cors.cors, getLeaders)
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, postLeader)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, deleteLeaders);

leaderRouter
    .route('/:id')
    .options(cors.corsWithOptions, leaderOptions)
    .get(cors.cors, getLeaderByParam)
    .patch(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, patchLeaderByParam)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, deleteLeaderByParam);

module.exports = leaderRouter;
