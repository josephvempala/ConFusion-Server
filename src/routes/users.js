const express = require('express');
const router = express.Router();
const cors = require('../../cors');
const authenticate = require('../../authenticate');
const {getUsers, signup, login, verify, usersOptions} = require('../controllers/users');

router.options('*', cors.corsWithOptions, usersOptions);
router.get('/', cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, getUsers);
router.options('/signup', cors.corsWithOptions, usersOptions);
router.post('/signup', cors.corsWithOptions, signup);
router.put('/signup', cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.send('put operation not supported on signup endpoint');
});
router.delete('/signup', cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.send('delete operation not supported on signup endpoint');
});
router.options('/login', cors.corsWithOptions, usersOptions);
router.get('/login', cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.send('get operation not supported on login endpoint');
});
router.put('/login', cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.send('put operation not supported on login endpoint');
});
router.post('/login', cors.corsWithOptions, login);
router.delete('/login', cors.corsWithOptions, (req, res) => {
    res.statusCode = 403;
    res.send('delete operation not supported on login endpoint');
});

router.get('/verify', cors.corsWithOptions, verify);
module.exports = router;
