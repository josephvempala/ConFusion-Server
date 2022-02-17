const Leaders = require('../models/leaders');

const leaderOptions = (req, res) => {
    res.sendStatus(200);
}

const getLeaders = async (req, res, next) => {
    try {
        const leaders = await Leaders.find(req.query);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    } catch (e) {
        next(e);
    }
}

const postLeader = async (req, res, next) => {
    try {
        const newLeader = await Leaders.create(req.body);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(newLeader);
    } catch (e) {
        next(e);
    }
}

const deleteLeaders = async (req, res) => {
    const result = await Leaders.remove({});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(result);
}

const getLeaderByParam = async (req, res, next) => {
    try {
        const leader = await Leaders.findById(req.params.id);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    } catch (e) {
        next(e);
    }
}

const patchLeaderByParam = async (req, res, next) => {
    try {
        const updatedLeader = await Leaders.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(updatedLeader);
    } catch (e) {
        next(e);
    }
}

const deleteLeaderByParam = async (req, res, next) => {
    try {
        const result = await Leaders.findByIdAndRemove(req.params.id);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    } catch (e) {
        next(e);
    }
}

module.exports = {
    deleteLeaderByParam,
    deleteLeaders,
    getLeaderByParam,
    getLeaders,
    leaderOptions,
    patchLeaderByParam,
    postLeader
}